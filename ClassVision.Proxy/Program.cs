var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.WebHost.ConfigureKestrel(option =>
{
    option.Limits.MaxRequestBodySize = long.MaxValue;
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddServiceDiscoveryDestinationResolver();
// Add services to the container.

//builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.MapDefaultEndpoints();
app.MapReverseProxy();

await app.RunAsync();

