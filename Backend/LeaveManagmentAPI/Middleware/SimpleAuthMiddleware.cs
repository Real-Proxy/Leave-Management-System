using System.Security.Claims;
using LeaveManagementAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagementAPI.Middleware
{
    public class SimpleAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public SimpleAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
        {
            // Create a scope to resolve scoped services (DbContext)
            using (var scope = serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // Check for custom header
                if (context.Request.Headers.TryGetValue("X-User-Id", out var userIdValue) && 
                    int.TryParse(userIdValue, out int userId))
                {
                    var user = await dbContext.Users.FindAsync(userId);
                    if (user != null)
                    {
                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                            new Claim(ClaimTypes.Name, user.Name),
                            new Claim(ClaimTypes.Role, user.Role.ToString())
                        };

                        var identity = new ClaimsIdentity(claims, "SimpleAuth");
                        var principal = new ClaimsPrincipal(identity);

                        context.User = principal;
                    }
                }
            }

            await _next(context);
        }
    }
}
