using ClassVision.Data.Entities;
using Mediator;
using Microsoft.AspNetCore.Identity;

namespace ClassVision.API.Handlers.Accounts;

public class AddAccountRequest(AppUser data, string password) : IRequest<IdentityResult>
{
    public AppUser Data { get; } = data;

    public string Password { get; } = password;
}
