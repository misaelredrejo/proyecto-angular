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
    public class LogsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public LogsController(ApplicationDbContext context)
        {
            _context = context;
        }

       

        // POST api/<LogsController>
        [HttpPost]
        public async Task<ApiResponse> Post([FromBody] Log log)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                var user = await _context.User.FindAsync(log.User.UserId);
                if (user == null)
                {
                    myResponse.Status = Status.NotFound;
                    myResponse.Message = "No existe el usuario.";
                    myResponse.Data = null;
                    return myResponse;
                }
                var comment = await _context.Comment.FindAsync(log.CommentId);
                if (comment == null)
                {
                    myResponse.Status = Status.NotFound;
                    myResponse.Message = "No existe el comentario.";
                    myResponse.Data = null;
                    return myResponse;
                }
                _context.Entry(user).State = EntityState.Detached;
                _context.Log.Update(log);
                await _context.SaveChangesAsync();
                myResponse.Status = Status.Success;
                myResponse.Message = "";
                myResponse.Data = log;
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
