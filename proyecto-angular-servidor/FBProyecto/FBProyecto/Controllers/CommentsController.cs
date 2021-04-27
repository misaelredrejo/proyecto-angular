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
                var commentList = await _context.Comment.Where(c => c.Path == path).Include(c => c.Logs).ThenInclude(l => l.User).ToListAsync();
                return Ok(commentList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET api/<CommentsController>/path
        [HttpGet("last10")]
        public async Task<IActionResult> GetLast10Comments()
        {
            try
            {
                var listCommentDTO = await _context.CommentDTO.FromSqlRaw("exec dbo.Last10Logs").ToListAsync();
                return Ok(listCommentDTO);
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
                var user = await _context.User.FindAsync(comment.Logs.FirstOrDefault().User.UserId);
                if (user == null) return NotFound();
                comment.Logs.FirstOrDefault().UserId = comment.Logs.FirstOrDefault().User.UserId;
                comment.Logs.FirstOrDefault().User = null;

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
                var user = await _context.User.FindAsync(comment.Logs.LastOrDefault().User.UserId);
                if (user == null) return NotFound();
                for (int i = 0; i < comment.Logs.Count; i++)
                {
                    comment.Logs[i].UserId = comment.Logs[i].User.UserId;
                    comment.Logs[i].User = null;
                }
                _context.Update(comment);
                await _context.SaveChangesAsync();
                return Ok(comment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<CommentsController>/delete/5
        [HttpPut("delete/{id}")]
        public async Task<IActionResult> Delete(int id, [FromBody] Comment comment)
        {
            try
            {
                var user = await _context.User.FindAsync(comment.Logs.LastOrDefault().User.UserId);
                if (user == null) return NotFound();
                comment.IsActive = false;
                for (int i = 0; i < comment.Logs.Count; i++)
                {
                    comment.Logs[i].UserId = comment.Logs[i].User.UserId;
                    comment.Logs[i].User = null;
                }
                _context.Update(comment);
                await _context.SaveChangesAsync();
                return Ok(comment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<CommentsController>/activate/5
        [HttpPut("activate/{id}")]
        public async Task<IActionResult> Activate(int id, [FromBody] Comment comment)
        {
            try
            {
                var user = await _context.User.FindAsync(comment.Logs.LastOrDefault().User.UserId);
                if (user == null) return NotFound();
                comment.IsActive = true;
                for (int i = 0; i < comment.Logs.Count; i++)
                {
                    comment.Logs[i].UserId = comment.Logs[i].User.UserId;
                    comment.Logs[i].User = null;
                }
                _context.Update(comment);
                await _context.SaveChangesAsync();
                return Ok(comment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
