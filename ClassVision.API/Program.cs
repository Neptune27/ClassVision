using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Scalar.AspNetCore;
using ClassVision.Data;
using ClassVision.Data.Entities;
using ClassVision.API.Extensions;
using ClassVision.API.Interfaces.Services;
using ClassVision.API.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using ClassVision.API.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddDbContext<AppDBContext>(option =>
{
    option.UseNpgsql(builder.Configuration.GetConnectionString("ClassVision"));
    
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddSingleton<HttpClient>();
builder.Services.AddSingleton<SpreadsheetService>();

builder.Services.AddMediator();

builder.Services.AddIdentity<AppUser, IdentityRole>(option =>
{
    option.Password.RequireDigit = true;
    option.Password.RequireLowercase = true;
    option.Password.RequireUppercase = true;
    option.Password.RequireNonAlphanumeric = true;
    option.Password.RequiredLength = 8;
    option.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<AppDBContext>();

builder.AddDefaultJWTConfig();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddSignalR();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi("v1", options => { options.AddDocumentTransformer<BearerSecuritySchemeTransformer>(); });


var app = builder.Build();

app.MapDefaultEndpoints();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi("/api/openapi/{documentName}.json");
    app.MapScalarApiReference("api", options =>
    {
        options.Servers = [new("")];
        options.WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Fetch);
        options.WithOpenApiRoutePattern("/api/openapi/v1.json");
    });
}

//app.UseHttpsRedirection();

var fileServerOption = new FileServerOptions
{
};

fileServerOption.StaticFileOptions.ServeUnknownFileTypes = true;
fileServerOption.EnableDirectoryBrowsing = true;
fileServerOption.StaticFileOptions.DefaultContentType = "application/binary";

app.UseFileServer(fileServerOption);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//Map SignalR message hub
app.MapHub<RollcallHub>("/api/rollcallhub");

app.Run();
