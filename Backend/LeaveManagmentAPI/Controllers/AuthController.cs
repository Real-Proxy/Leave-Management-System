using LeaveManagementAPI.DTOs;
using LeaveManagementAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                return Unauthorized("Invalid credentials");
            }

            return Ok(result);
        }
    }
}
