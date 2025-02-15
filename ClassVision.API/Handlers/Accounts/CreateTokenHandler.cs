using ClassVision.API.Interfaces.Services;
using ClassVision.Data.DTOs.Accounts;
using Mediator;
using Microsoft.Win32;

namespace ClassVision.API.Handlers.Accounts;

public class CreateTokenHandler(
    ITokenService tokenService
    ) : IRequestHandler<CreateTokenRequest, TokenResultDto>
{
    private readonly ITokenService tokenService = tokenService;

    public async ValueTask<TokenResultDto> Handle(CreateTokenRequest request, CancellationToken cancellationToken)
    {
        var appUser = request.AppUser;

        return new TokenResultDto(appUser.Id, appUser.UserName, appUser.Email,
            await tokenService.CreateToken(appUser, request.Host));
    }
}
