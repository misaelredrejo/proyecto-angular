using FBProyecto.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;

namespace FBProyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }


        // GET: api/<UserController>
        [HttpGet]
        public async Task<ApiResponse> Get()
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                string username = AccountHelper.GetWinAuthAccount(HttpContext);
                User user = await _context.User.Where(u => u.Username == username).SingleOrDefaultAsync();

                if (user == null)
                {
                    myResponse.Status = Status.NotFound;
                    myResponse.Message = "El usuario " + username + " no existe.";
                    myResponse.Data = null;
                    return myResponse;
                }
                myResponse.Status = Status.Success;
                myResponse.Message = "";
                myResponse.Data = user;
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

        // GET: api/<UserController>
        [HttpGet("active")]
        public async Task<ApiResponse> GetActiveUsers()
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                var users = await _context.User.Where(u => u.Logs.Count > 0).ToListAsync();

                myResponse.Status = Status.Success;
                myResponse.Message = "";
                myResponse.Data = users;
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

        [HttpPost]
        public async Task<ApiResponse> Post([FromBody] User user)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                string username = AccountHelper.GetWinAuthAccount(HttpContext);
                user.Username = username;
                _context.User.Add(user);
                await _context.SaveChangesAsync();

                myResponse.Status = Status.Success;
                myResponse.Message = "Usuario añadido correctamente.";
                myResponse.Data = user;
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


        [HttpPut("{id}")]
        public async Task<ApiResponse> Put(int id, [FromBody] User user)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                var userDb = await _context.User.FindAsync(user.UserId);
                if (userDb == null)
                {
                    myResponse.Status = Status.NotFound;
                    myResponse.Message = "No existe el usuario.";
                    myResponse.Data = null;
                    return myResponse;
                }
                _context.Entry(userDb).State = EntityState.Detached;
                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                myResponse.Status = Status.Success;
                myResponse.Message = "Usuario editado correctamente.";
                myResponse.Data = user;
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


    public class AccountHelper
    {
        public static string GetWinAuthAccount(HttpContext context)
        {
            IPrincipal p = context.User;
            return p.Identity.Name;
        }
    }
}
