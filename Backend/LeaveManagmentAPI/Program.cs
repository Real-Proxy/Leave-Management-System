using LeaveManagementAPI.Data;
using LeaveManagementAPI.Middleware;
using LeaveManagementAPI.Services;
using LeaveManagementAPI; // Required for SeedData
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("X-User-Id", new OpenApiSecurityScheme
    {
        Description = "User ID header for custom auth (e.g. '1' for Admin)",
        Name = "X-User-Id",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "X-User-Id"
                }
            },
            new List<string>()
        }
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=leaves.db"));

// Register Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILeaveTypeService, LeaveTypeService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    SeedData.Initialize(scope.ServiceProvider);
}

// Configure the HTTP request pipeline.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseCors("AllowAngular");

// Custom Auth Middleware
app.UseMiddleware<SimpleAuthMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
