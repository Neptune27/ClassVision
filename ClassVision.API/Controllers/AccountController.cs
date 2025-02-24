﻿using ClassVision.API.Handlers.Accounts;
using ClassVision.Data.DTOs.Accounts;
using ClassVision.Data.Entities;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ClassVision.API.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class AccountController(ILogger<AccountController> logger,
    SignInManager<AppUser> signInManager,
    UserManager<AppUser> userManager,
    IMediator mediator
    ) : ControllerBase
{
    private readonly ILogger<AccountController> logger = logger;
    private readonly SignInManager<AppUser> signInManager = signInManager;
    private readonly UserManager<AppUser> userManager = userManager;
    private readonly IMediator mediator = mediator;

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

            var dto = await mediator.Send(new CreateTokenRequest(user, Request.Host));

            return Ok(dto);

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

            var createdUser = await mediator.Send(new AddAccountRequest(appUser, register.Password));

            if (!createdUser.Succeeded)
            {
                return StatusCode(500, createdUser.Errors);
            }

            var roleResult = await mediator.Send(new AddToRoleRequest(appUser, "User"));

            if (!roleResult.Succeeded)
            {
                return StatusCode(500, roleResult.Errors);
            }


            var token = await mediator.Send(new CreateTokenRequest(appUser, Request.Host));
            //var publish = await mediator.Send(new PublishAccountInternalRequest(register));
            return Ok(token);

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
}
