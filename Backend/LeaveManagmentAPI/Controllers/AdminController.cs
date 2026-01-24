using LeaveManagementAPI.Models;
using LeaveManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILeaveTypeService _leaveTypeService;

        public AdminController(IUserService userService, ILeaveTypeService leaveTypeService)
        {
            _userService = userService;
            _leaveTypeService = leaveTypeService;
        }

        // --- User Management ---

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            try
            {
                var createdUser = await _userService.CreateUserAsync(user);
                return CreatedAtAction(nameof(GetAllUsers), new { id = createdUser.Id }, createdUser);
            }
            catch (InvalidOperationException ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // --- Leave Type Management ---

        [HttpPost("leavetypes")]
        public async Task<IActionResult> AddLeaveType([FromBody] LeaveType leaveType)
        {
            var created = await _leaveTypeService.AddLeaveTypeAsync(leaveType);
            return Ok(created);
        }

        [HttpGet("leavetypes")]
        public async Task<IActionResult> GetLeaveTypes()
        {
            var types = await _leaveTypeService.GetAllLeaveTypesAsync();
            return Ok(types);
        }

        [HttpPut("leavetypes/{id}")]
        public async Task<IActionResult> UpdateLeaveType(int id, [FromBody] LeaveType leaveType)
        {
            var updated = await _leaveTypeService.UpdateLeaveTypeAsync(id, leaveType);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
    }
}
