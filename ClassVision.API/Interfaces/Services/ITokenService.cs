using ClassVision.Data.Entities;

namespace ClassVision.API.Interfaces.Services;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user, HostString host);

}
