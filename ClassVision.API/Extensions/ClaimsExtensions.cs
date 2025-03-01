using System.Security.Claims;

namespace ClassVision.API.Extensions;

public static class ClaimsExtensions
{
    public static Claim? GetClaimByUserId(this IEnumerable<Claim> claims)
    {
        return claims.FirstOrDefault(it => it.Type == ClaimTypes.NameIdentifier);
    }
}