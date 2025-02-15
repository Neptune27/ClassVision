using ClassVision.Data.Entities;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.Win32;

namespace ClassVision.API.Handlers.Accounts;

public class AddToRoleHandler(
    UserManager<AppUser> userManager,
    ILogger<AddToRoleHandler> logger
    ) : IRequestHandler<AddToRoleRequest, IdentityResult>
{
    public UserManager<AppUser> UserManager { get; } = userManager;

    public async ValueTask<IdentityResult> Handle(AddToRoleRequest request, CancellationToken cancellationToken)
    {
        var appUser = request.User;
        var role = request.Role;

        var roleResult = await userManager.AddToRoleAsync(appUser, role);

        if (!roleResult.Succeeded)
        {
            logger.LogWarning("Role for User {User} had not been created with errors: {Errors}",
                appUser.UserName,
                string.Join(",",
                            roleResult.Errors.Select(it => it.ToString())
                    )
                );
        }
        return roleResult;

    }
}
