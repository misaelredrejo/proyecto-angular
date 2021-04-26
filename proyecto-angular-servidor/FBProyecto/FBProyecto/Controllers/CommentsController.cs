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
    public class CommentsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public CommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/<CommentsController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var commentList = await _context.Comment.Include(c => c.Logs).ThenInclude(l => l.User).ToListAsync();
                return Ok(commentList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<CommentsController>/path
        [HttpGet("{*path}")]
        public async Task<IActionResult> Get(string path)
        {
            try
            {
                path = path.Replace("%2F", "/");
                var commentList = await _context.Comment.Where(c => c.Path == path).ToListAsync();
                return Ok(commentList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        // GET api/<ComentariosController>/5
        [HttpGet("subpath/{*path}", Name = "CommentsSubPathByPath")]
        public async Task<IActionResult> CommentsSubPathByPath(string path)
        {
            try
            {
                path = path.Replace("%2F", "/");
                int cntCommentsSubPath = await _context.Comment.Where(c => c.Path.Contains(path) && c.IsActive).CountAsync();
                return Ok(cntCommentsSubPath);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // POST api/<CommentsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Comment comment)
        {
            try
            {

                _context.Comment.Add(comment);
                await _context.SaveChangesAsync();
                return Ok(comment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        // PUT api/<CommentsController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Comment comment)
        {
            try
            {

                _context.Update(comment);
                await _context.SaveChangesAsync();
                return Ok(comment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<CommentsController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok();
        }
    }
}
