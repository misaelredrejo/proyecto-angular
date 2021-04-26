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

        // GET: api/<LogsController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var logList = await _context.Log.Include(l => l.User).ToListAsync();
                return Ok(logList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<LogsController>/5
        [HttpGet("last10")]
        public async Task<IActionResult> GetLast10()
        {
            try
            {
                var logList = await _context.Log.OrderByDescending(l => l.LogId).Take(10).ToListAsync();
                return Ok(logList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
