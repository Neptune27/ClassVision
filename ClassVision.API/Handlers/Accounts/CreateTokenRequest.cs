using ClassVision.Data.DTOs.Accounts;
using ClassVision.Data.Entities;
using Mediator;

namespace ClassVision.API.Handlers.Accounts;

public class CreateTokenRequest(
    AppUser appUser,
    HostString host
    ) : IRequest<TokenResultDto>
{
    public AppUser AppUser { get; } = appUser;
    public HostString Host { get; } = host;
}
