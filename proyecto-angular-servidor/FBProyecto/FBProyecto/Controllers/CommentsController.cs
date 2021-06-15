using FBProyecto.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
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


        // GET api/<CommentsController>/path
        [HttpGet("{*path}")]
        public async Task<ApiResponse> Get(string path)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                path = path.Replace("%2F", "/");
                var commentList = await _context.Comment.Where(c => c.Path == path).ToListAsync();
                myResponse.Status = Status.Success;
                myResponse.Message = "";
                myResponse.Data = commentList;
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

        // GET api/<CommentsController>/path
        [HttpGet("commentlogs/last{n}")]
        public async Task<ApiResponse> GetLast10CommentLogs(int n)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                var listCommentDTO = await _context.CommentLog.FromSqlRaw($"exec dbo.LastNLogs {n}").ToListAsync();
                myResponse.Status = Status.Success;
                myResponse.Message = "";
                myResponse.Data = listCommentDTO;
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

        // GET api/<CommentsController>/path
        [HttpGet("commentlogs/filter")]
        public async Task<ApiResponse> GetCommentLogsByFilter([FromQuery] FilterQuery filterQuery)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                var startDate = filterQuery.StartDate.ToString("yyyy-MM-dd");
                var endDate = filterQuery.EndDate.ToString("yyyy-MM-dd");

                string sqlQuery = $"exec dbo.CommentLogsFilter @Username = {(filterQuery.Username != null ?  "'" + filterQuery.Username + "'" : "null")}, @Action = {(filterQuery.Action != null ? (int)filterQuery.Action : "null")}, @StartDate = '{startDate}', @EndDate = '{endDate}'";
                var listCommentDTO = await _context.CommentLog.FromSqlRaw(sqlQuery).ToListAsync();

                myResponse.Status = Status.Success;
                myResponse.Message = "";
                myResponse.Data = listCommentDTO;
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


        // GET api/<ComentariosController>/5
        [HttpGet("subpath/{*path}", Name = "CommentsSubPathByPath")]
        public async Task<ApiResponse> CommentsSubPathByPath(string path)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                path = path.Replace("%2F", "/");
                int cntCommentsSubPath = await _context.Comment.Where(c => (c.Path.Contains("/" + path + "/") || c.Path.StartsWith(path + "/") || c.Path.EndsWith("/" + path)) && c.IsActive).CountAsync();
                myResponse.Status = Status.Success;
                myResponse.Message = "";
                myResponse.Data = cntCommentsSubPath;
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

        // GET api/<ComentariosController>/5
        [HttpGet("cntByPath/{path}", Name = "CntByPath")]
        public async Task<ApiResponse> CntByPath(string path)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                int cntCommentsPath = await _context.Comment.Where(c => c.Path == path && c.IsActive).CountAsync();
                myResponse.Status = Status.Success;
                myResponse.Message = "";
                myResponse.Data = cntCommentsPath;
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

        // POST api/<CommentsController>
        [HttpPost]
        public async Task<ApiResponse> Post([FromBody] Comment comment)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                _context.Comment.Add(comment);
                await _context.SaveChangesAsync();
                myResponse.Status = Status.Success;
                myResponse.Message = "Comentario añadido correctamente.";
                myResponse.Data = comment;
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

        // PUT api/<CommentsController>/5
        [HttpPut("{id}")]
        public async Task<ApiResponse> Put(int id, [FromBody] Comment comment)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                if (id != comment.CommentId)
                {
                    myResponse.Status = Status.NotFound;
                    myResponse.Message = "No existe el comentario.";
                    myResponse.Data = null;
                    return myResponse;
                }
                _context.Update(comment);
                await _context.SaveChangesAsync();
                myResponse.Status = Status.Success;
                myResponse.Message = "Comentario actualizado correctamente.";
                myResponse.Data = comment;
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
