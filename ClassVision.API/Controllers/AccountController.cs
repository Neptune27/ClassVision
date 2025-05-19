using ClassVision.API.Handlers.Accounts;
using ClassVision.Data;
using ClassVision.Data.DTOs.Accounts;
using ClassVision.Data.DTOs.Classrooms;
using ClassVision.Data.Entities;
using DocumentFormat.OpenXml.Spreadsheet;
using Humanizer;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ClassVision.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class AccountController(ILogger<AccountController> logger,
    SignInManager<AppUser> signInManager,
    UserManager<AppUser> userManager,
    RoleManager<IdentityRole> roleManager,
    IMediator mediator,
    AppDBContext context
    ) : ControllerBase
{
    private readonly ILogger<AccountController> logger = logger;
    private readonly SignInManager<AppUser> signInManager = signInManager;
    private readonly UserManager<AppUser> userManager = userManager;
    private readonly RoleManager<IdentityRole> roleManager = roleManager;
    private readonly IMediator mediator = mediator;
    private readonly AppDBContext context = context;

    [HttpPost("[action]")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }


        try
        {
            var user = await mediator.Send(new GetAccountRequest(loginDto.Username));
            var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded)
            {
                throw new ValidationException("Wrong Password");
            }

            var classUser = await context.ClassUsers.Where(u => u.User == user).SingleAsync();
            classUser.LoginTime.Add(DateTimeOffset.UtcNow);

            await context.SaveChangesAsync();

            var dto = await mediator.Send(new CreateTokenRequest(user, Request.Host));
            var roles = await userManager.GetRolesAsync(user);
            return Ok(new
            {
                Data = dto,
                Roles = roles
            });

        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
        }

    }

    [HttpPost("[action]")]
    public async Task<IActionResult> Register([FromBody] RegisterDto register)
    {

        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var appUser = new AppUser { UserName = register.UserName, Email = register.Email };

            var createdUserResult = await mediator.Send(new AddAccountRequest(appUser, register.Password));

            if (!createdUserResult.Succeeded)
            {
                return StatusCode(500, createdUserResult.Errors);
            }

            if (register.UserName == "admin")
            {
                await mediator.Send(new AddToRoleRequest(appUser, "Admin"));
            }

            var roleResult = await mediator.Send(new AddToRoleRequest(appUser, "User"));
            var createdUser = await userManager.Users.Where(u => u.UserName == register.UserName).SingleAsync();

            if (!roleResult.Succeeded)
            {

                await userManager.DeleteAsync(createdUser);

                return StatusCode(500, roleResult.Errors);
            }

            context.ClassUsers.Add(new()
            {
                Id = Guid.CreateVersion7().ToString(),
                User = createdUser,
                FirstName = register.FirstName,
                LastName = register.LastName
            });

            await context.SaveChangesAsync();


            var token = await mediator.Send(new CreateTokenRequest(appUser, Request.Host));
            //var publish = await mediator.Send(new PublishAccountInternalRequest(register));
            var roles = await userManager.GetRolesAsync(createdUser);
            return Ok(new
            {
                Data = token,
                Roles = roles
            });
        }
        catch (Exception e)
        {
            logger.LogError("Register Error: {e}", e.Message);
            return StatusCode(500, e);
        }
    }

    [HttpGet("")]
    [Authorize]
    public async Task<IActionResult> Index([FromQuery] string? name)
    {
        if (name is null)
        {
            return Ok(await userManager.Users.ToListAsync());
        }
        var data = await userManager.Users
            .Where(u => u.UserName.ToUpper().Contains(name.ToUpper()))
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("AllRoles")]
    [Authorize]
    public async Task<IActionResult> GetAllRoles()
    {
        var roles = await roleManager.Roles.ToListAsync();
        return Ok(roles);
    }

    public record UserRoles(string Id, string UserName, IList<string> Roles);

    [HttpGet("Roles")]
    [Authorize]
    public async Task<IActionResult> UserWithRoles()
    {
        var users = await userManager.Users.ToListAsync();


        List<UserRoles> userRoles = [];
        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            userRoles.Add(new(user.Id, user.UserName, roles));
        }
        return Ok(userRoles);
    }

    public record UpdateRoleDto(string UserId, List<string> Roles);

    [HttpPost("Roles")]
    [Authorize]
    public async Task<IActionResult> UpdateRoles(UpdateRoleDto dto)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == dto.UserId);
        if (user is null)
        {
            return NotFound("Cannot find user");
        }
        if (dto.Roles.Count == 0)
        {

            return BadRequest();
        }

        var userCurrentRoles = await userManager.GetRolesAsync(user);
        var result = await userManager.RemoveFromRolesAsync(user, userCurrentRoles);
        if (!result.Succeeded)
        {
            // Handle errors
            foreach (var error in result.Errors)
            {
                Debug.WriteLine($"Error: {error.Description}");
            }

            return BadRequest();
        }

        var addResult = await userManager.AddToRolesAsync(user, dto.Roles);

        return Ok(addResult);
    }
}
