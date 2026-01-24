using LeaveManagementAPI.Data;
using LeaveManagementAPI.Middleware;
using LeaveManagementAPI.Services;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // db.Database.EnsureCreated(); // Handled in SeedData
    SeedData.Initialize(scope.ServiceProvider);
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

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
