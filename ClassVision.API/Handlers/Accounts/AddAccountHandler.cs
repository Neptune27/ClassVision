using ClassVision.Data.Entities;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.Win32;
//using SocialNetwork.Identity.Data.Context;
//using SocialNetwork.Identity.Data.Models;

namespace ClassVision.API.Handlers.Accounts;

public class AddAccountHandler(
    UserManager<AppUser> userManager,
    ILogger<AddAccountHandler> logger
    ) : IRequestHandler<AddAccountRequest, IdentityResult>
{
    private readonly UserManager<AppUser> userManager = userManager;

    public ILogger<AddAccountHandler> Logger { get; } = logger;

    public async ValueTask<IdentityResult> Handle(AddAccountRequest request, CancellationToken cancellationToken)
    {
        var appUser = request.Data;
        var password = request.Password;


        var createdUser = await userManager.CreateAsync(appUser, password);
        
        if (!createdUser.Succeeded)
        {
            logger.LogWarning("User {User} had not been created with errors: {Errors}",
                appUser.UserName,
                string.Join(",",
                            createdUser.Errors.Select(it => it.ToString())
                    )
                );
        }

        return createdUser;
    }

    //public async ValueTask<IdentityResult> Handle(AddAccountRequest request, CancellationToken cancellationToken)
    //{
    //    var register = request.Data;

    //    var appUser = new AppUser { UserName = register.UserName, Email = register.Email };

    //    var createdUser = await userManager.CreateAsync(appUser, register.Password);

    //    return createdUser;
    //}

}
