using ClassVision.Data.Entities;
using Mediator;

namespace ClassVision.API.Handlers.Accounts;

public class GetAccountRequest(
    string username
    ) : IRequest<AppUser>
{
    public string Username { get; } = username;
}
