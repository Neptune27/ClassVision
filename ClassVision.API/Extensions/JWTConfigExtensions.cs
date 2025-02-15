using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace ClassVision.API.Extensions;


public static class JWTConfigExtensions
{
    public static IHostApplicationBuilder AddDefaultJWTConfig(this IHostApplicationBuilder builder, Action<JwtBearerOptions> action)
    {
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultScheme =
            options.DefaultChallengeScheme =
            options.DefaultForbidScheme =
            options.DefaultAuthenticateScheme =
            options.DefaultSignInScheme =
            options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
        })
           .AddJwtBearer(options =>
           {
               var signingKey = builder.Configuration["JWT:SigningKey"];

               ArgumentException.ThrowIfNullOrEmpty(signingKey);

               options.TokenValidationParameters = new TokenValidationParameters
               {
                   ValidateIssuer = true,
                   ValidIssuer = builder.Configuration["JWT:Issuer"],
                   ValidateAudience = true,
                   ValidAudiences = builder.Configuration.GetSection("JWT:Audiences").Get<List<string>>(),

                   ValidateIssuerSigningKey = true,
                   IssuerSigningKey = new SymmetricSecurityKey(
                       System.Text.Encoding.UTF8.GetBytes(signingKey)
                   )

               };

               action.Invoke(options);

           });


        return builder;
    }


    public static IHostApplicationBuilder AddDefaultJWTConfig(this IHostApplicationBuilder builder)
    {
        return AddDefaultJWTConfig(builder, option => { });
    }
}
