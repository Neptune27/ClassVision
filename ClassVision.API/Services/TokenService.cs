using ClassVision.API.Interfaces.Services;
using ClassVision.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ClassVision.API.Services;


public class TokenService : ITokenService
{
    private readonly IConfiguration configuration;
    private readonly UserManager<AppUser> userManager;
    private readonly SymmetricSecurityKey key;

    private readonly JwtSecurityTokenHandler tokenHandler = new();

    public TokenService(IConfiguration configuration, UserManager<AppUser> userManager)
    {
        this.configuration = configuration;
        this.userManager = userManager;
        var signingKey = configuration["JWT:SigningKey"];
        ArgumentException.ThrowIfNullOrEmpty(signingKey);
        key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(signingKey)
            );

    }

    public async Task<string> CreateToken(AppUser user, HostString host)
    {
        List<Claim> claims = [
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.GivenName, user.UserName),
            ];


        var roles = await userManager.GetRolesAsync(user);

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            SigningCredentials = creds,
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(1),
            Issuer = configuration["JWT:Issuer"],
            Audience = configuration["JWT:Issuer"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}