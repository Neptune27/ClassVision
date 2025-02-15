using ClassVision.Data.Entities;
using Mediator;
using Microsoft.AspNetCore.Identity;

namespace ClassVision.API.Handlers.Accounts;

public class AddToRoleRequest(AppUser user, string role) : IRequest<IdentityResult>
{
    public AppUser User { get; } = user;
    public string Role { get; } = role;
}
