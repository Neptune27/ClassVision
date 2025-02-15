using ClassVision.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using OpenTelemetry.Trace;
//using SocialNetwork.Identity.Data.Context;
using System;
using System.Diagnostics;
using System.Threading;

namespace ClassVision.Migration;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IServiceProvider serviceProvider;
    private readonly IHostApplicationLifetime hostApplicationLifetime;

    public const string ActivitySourceName = "Identity Migrations";
    private static readonly ActivitySource s_activitySource = new(ActivitySourceName);

    public Worker(ILogger<Worker> logger,
        IServiceProvider serviceProvider,
        IHostApplicationLifetime hostApplicationLifetime)
    {
        _logger = logger;
        this.serviceProvider = serviceProvider;
        this.hostApplicationLifetime = hostApplicationLifetime;
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using var activity = s_activitySource.StartActivity("Migrating database", ActivityKind.Client);


        try
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDBContext>();

            await EnsureDatabaseAsync(dbContext, cancellationToken);
            await AddExtensionAsync(dbContext, "vector", cancellationToken);
            await RunMigrationAsync(dbContext, cancellationToken);
        }
        catch (Exception ex)
        {
            activity?.RecordException(ex);
            throw;
        }

        hostApplicationLifetime.StopApplication();

        //while (!cancellationToken.IsCancellationRequested)
        //{
        //    if (_logger.IsEnabled(LogLevel.Information))
        //    {
        //        _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
        //    }
        //    await Task.Delay(1000, cancellationToken);
        //}
    }

    private static async Task EnsureDatabaseAsync(AppDBContext dbContext, CancellationToken cancellationToken)
    {
        var dbCreator = dbContext.GetService<IRelationalDatabaseCreator>();

        //var strategy = dbContext.Database.CreateExecutionStrategy();
        //await strategy.ExecuteAsync(async () =>
        //{
        //    // Create the database if it does not exist.
        //    // Do this first so there is then a database to start a transaction against.
        //    if (!await dbCreator.ExistsAsync(cancellationToken))
        //    {
        //        await dbCreator.CreateAsync(cancellationToken);
        //    }
        //});

        // Create the database if it does not exist.
        // Do this first so there is then a database to start a transaction against.
        if (!await dbCreator.ExistsAsync(cancellationToken))
        {
            await dbCreator.CreateAsync(cancellationToken);
        }
    }

    private static async Task AddExtensionAsync(AppDBContext dbContext, string extension, CancellationToken cancellationToken)
    {
        await dbContext.Database.ExecuteSqlRawAsync($"""CREATE EXTENSION IF NOT EXISTS {extension}""", cancellationToken: cancellationToken);
    }

    private static async Task RunMigrationAsync(AppDBContext dbContext, CancellationToken cancellationToken)
    {
        //var strategy = dbContext.Database.CreateExecutionStrategy();
        //await strategy.ExecuteAsync(async () =>
        //{
        //    // Run migration in a transaction to avoid partial migration if it fails.
        //    await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        //    dbContext.Database.Migrate();
        //    await transaction.CommitAsync(cancellationToken);
        //});

        //await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        await dbContext.Database.MigrateAsync();
        //await transaction.CommitAsync(cancellationToken);
    }
}
