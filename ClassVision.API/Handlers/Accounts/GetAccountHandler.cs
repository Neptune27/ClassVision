using ClassVision.Data.Entities;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ClassVision.API.Handlers.Accounts;

public class GetAccountHandler(
    UserManager<AppUser> userManager
    ) : IRequestHandler<GetAccountRequest, AppUser>
{
    public async ValueTask<AppUser> Handle(GetAccountRequest request, CancellationToken cancellationToken)
    {
        var username = request.Username;
        var user = await userManager.Users.
            FirstOrDefaultAsync(it => it.UserName == username, cancellationToken: cancellationToken);

        return user ?? throw new ValidationException("Username not found");
    }
}
