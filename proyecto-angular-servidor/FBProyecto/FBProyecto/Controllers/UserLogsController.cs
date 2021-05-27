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

        // GET api/<UserLogsController>/5/ruta
        [HttpGet("{userId}/{path}")]
        public async Task<ApiResponse> GetUserLog(int userId, string path)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                bool commentsNotReadInPath = await _context.UserLog.AnyAsync(
                    userLog =>
                    userLog.Read == false &&
                    userLog.User.UserId == userId
                    && (userLog.Log.Comment.Path.Contains("/" + path + "/")
                        || userLog.Log.Comment.Path.StartsWith(path + "/")
                        || userLog.Log.Comment.Path.EndsWith("/" + path))
                    ); ;
                myResponse.Status = Status.Success;
                myResponse.Message = "";
                myResponse.Data = commentsNotReadInPath;
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

        // DELETE api/<UserLogsController>
        [HttpDelete("{userId}/{*path}")]
        public async Task<ApiResponse> DeleteUserLog(int userId, string path)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                path = path.Replace("%2F", "/");
                var userLogs = await _context.UserLog.Where(userLog => userLog.User.UserId == userId && userLog.Log.Comment.Path == path).ToListAsync();
                if (userLogs != null && userLogs.Count > 0)
                {
                    _context.RemoveRange(userLogs);
                    await _context.SaveChangesAsync();
                }
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
