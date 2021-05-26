using FBProyecto.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FBProyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserLogsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public UserLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET api/<UserLogsController>/5/8
        [HttpGet("{userId}/{*path}")]
        public async Task<ApiResponse> GetUserLog(int userId, string path)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                //bool commentsNotReadInPath = await _context.UserLog.AnyAsync(userLog => userLog.Read == false && userLog.User.UserId == userId && userLog.Log.Comment.Path == path);
                myResponse.Status = Status.Success;
                myResponse.Message = "";
                myResponse.Data = null;
                return myResponse;
            }
            catch (Exception ex)
            {
                myResponse.Status = Status.Error;
                myResponse.Message = ex.Message;
                myResponse.Data = null;
                return myResponse;
            }
        }

    }
}
