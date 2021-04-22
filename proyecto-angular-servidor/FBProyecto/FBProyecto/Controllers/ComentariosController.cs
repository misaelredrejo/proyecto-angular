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
    public class ComentariosController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public ComentariosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/<ComentariosController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var listaComentarios = await _context.Comentario.ToListAsync();
                return Ok(listaComentarios);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/<ComentariosController>/last10
        [HttpGet("last10")]
        public async Task<IActionResult> Last10()
        {

            try
            {
                var listaComentarios = await _context.ComentarioDTO.FromSqlRaw("EXEC[dbo].[AccionUltimos10Com]").ToListAsync();
                return Ok(listaComentarios);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<ComentariosController>/5
        [HttpGet("{*path}", Name = "Get")]
        public async Task<IActionResult> GetByPath(string path)
        {
            try
            {
                path = path.Replace("%2F", "/");
                var listComments = await _context.Comentario.Where(c => c.Ruta == path && c.FechaBaja == null).ToListAsync();
                return Ok(listComments);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        
        /***/
        // GET api/<ComentariosController>/5
        /*[HttpGet("subpath/{*path}", Name = "Get")]
        public async Task<IActionResult> GetSubPath(string path)
        {
            try
            {
                path = path.Replace("%2F", "/");
                var listComments = await _context.Comentario.Where(c => c.Ruta == path && c.FechaBaja == null).ToListAsync();
                return Ok(listComments);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }*/


        // POST api/<ComentariosController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Comentario comentario)
        {
            try
            {
                _context.Comentario.Add(comentario);
                await _context.SaveChangesAsync();
                return Ok(comentario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        // PUT api/<ComentariosController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Comentario comentario)
        {
            try
            {
                
                var comentarioAnterior = await _context.Comentario.FindAsync(id);
                if (comentarioAnterior == null)
                {
                    return NotFound();
                }
                comentarioAnterior.FechaBaja = DateTime.Now;
                _context.Update(comentarioAnterior);
                comentario.Id = 0;
                _context.Add(comentario);
                await _context.SaveChangesAsync();
                return Ok(comentario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<ComentariosController>/5
        [HttpPost("{id}")]
        public async Task<IActionResult> Delete(int id, [FromBody] Comentario comentario)
        {
            try
            {
                var comentarioAnterior = await _context.Comentario.FindAsync(id);
                comentarioAnterior.FechaBaja = DateTime.Now;

                comentario.Texto = null;
                _context.Add(comentario);
                await _context.SaveChangesAsync();
                return Ok(new { message = "El comentario se eliminó correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
