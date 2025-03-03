var builder = DistributedApplication.CreateBuilder(args);


var password = builder.AddParameter("Password", secret: true);


//DB
var sql = builder.AddPostgres("ClassVision-Db", password)
    .WithImage("pgvector/pgvector", "0.8.0-pg17")
    .WithDataVolume("ClassVision.SqlData", isReadOnly: false)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithPgWeb();

var sqlDB = sql.AddDatabase("ClassVision");

var migration = builder.AddProject<Projects.ClassVision_Migration>("classvision-migration")
    .WithReference(sqlDB).WaitFor(sql);

#pragma warning disable ASPIREHOSTINGPYTHON001
var python_app = builder.AddPythonApp("classvision-ai", "../ClassVision.AI", "main.py", ".venv")
    .WithHttpEndpoint(targetPort: 8000, port: 8010)
       .WithExternalHttpEndpoints()
       .WithOtlpExporter();
#pragma warning restore ASPIREHOSTINGPYTHON001

var api = builder.AddProject<Projects.ClassVision_API>("classvision-api")
    .WithExternalHttpEndpoints()
    .WithReference(sqlDB).WaitFor(sql).WaitForCompletion(migration);


var frontend = builder.AddNpmApp("classvision-frontend", "../ClassVision.FrontEnd", "dev")
        .WithEnvironment("BROWSER", "none")
        .WithHttpEndpoint(env: "PORT")
        .WithExternalHttpEndpoints()
        .PublishAsDockerFile();


builder.AddProject<Projects.ClassVision_Proxy>("classvision-proxy")
    .WithHttpsEndpoint(8080, name: "proxy", isProxied: false)
    .WithReference(api)
    .WithReference(frontend)
    .WithReference(python_app)
    ;


builder.Build().Run();
