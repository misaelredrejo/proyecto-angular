﻿using FBProyecto.Models;
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
                var commentList = await _context.Comment.Where(c => c.Path == path).Include(c => c.Logs).ThenInclude(l => l.User).ToListAsync();
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

        [HttpGet("commentlogs/last2weeks")]
        public async Task<ApiResponse> GetCommentLogs()
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                string sqlQuery = $"exec dbo.CommentLogsFilter @Username = null, @Action = null, @StartDate = '{DateTime.Today.AddDays(-13).ToString("yyyy-MM-dd")}', @EndDate = '{DateTime.Today.ToString("yyyy-MM-dd")}'";
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

        // GET api/<CommentsController>/path
        [HttpGet("commentlogs/last10")]
        public async Task<ApiResponse> GetLast10CommentLogs()
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                var listCommentDTO = await _context.CommentLog.FromSqlRaw("exec dbo.Last10Logs 10").ToListAsync();
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
                int cntCommentsSubPath = await _context.Comment.Where(c => c.Path.Contains(path) && c.IsActive).CountAsync();
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

        // POST api/<CommentsController>
        [HttpPost]
        public async Task<ApiResponse> Post([FromBody] Comment comment)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                var user = await _context.User.FindAsync(comment.Logs.FirstOrDefault().User.UserId);
                if (user == null)
                {
                    myResponse.Status = Status.NotFound;
                    myResponse.Message = "No existe el usuario.";
                    myResponse.Data = null;
                    return myResponse;
                }
                comment.Logs.FirstOrDefault().UserId = comment.Logs.FirstOrDefault().User.UserId;
                comment.Logs.FirstOrDefault().User = null;

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
                var user = await _context.User.FindAsync(comment.Logs.LastOrDefault().User.UserId);
                if (user == null)
                {
                    myResponse.Status = Status.NotFound;
                    myResponse.Message = "No existe el usuario.";
                    myResponse.Data = null;
                    return myResponse;
                }

                for (int i = 0; i < comment.Logs.Count; i++)
                {
                    comment.Logs[i].UserId = comment.Logs[i].User.UserId;
                    comment.Logs[i].User = null;
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

        // DELETE api/<CommentsController>/delete/5
        [HttpPut("delete/{id}")]
        public async Task<ApiResponse> Delete(int id, [FromBody] Comment comment)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                var user = await _context.User.FindAsync(comment.Logs.LastOrDefault().User.UserId);
                if (user == null)
                {
                    myResponse.Status = Status.NotFound;
                    myResponse.Message = "No existe el usuario.";
                    myResponse.Data = null;
                    return myResponse;
                }
                comment.IsActive = false;

                for (int i = 0; i < comment.Logs.Count; i++)
                {
                    comment.Logs[i].UserId = comment.Logs[i].User.UserId;
                    comment.Logs[i].User = null;
                }
                _context.Update(comment);

                await _context.SaveChangesAsync();
                myResponse.Status = Status.Success;
                myResponse.Message = "Comentario borrado correctamente.";
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

        // DELETE api/<CommentsController>/activate/5
        [HttpPut("activate/{id}")]
        public async Task<ApiResponse> Activate(int id, [FromBody] Comment comment)
        {
            ApiResponse myResponse = new ApiResponse();
            try
            {
                var user = await _context.User.FindAsync(comment.Logs.LastOrDefault().User.UserId);
                if (user == null)
                {
                    myResponse.Status = Status.NotFound;
                    myResponse.Message = "No existe el usuario.";
                    myResponse.Data = null;
                    return myResponse;
                }
                comment.IsActive = true;
                for (int i = 0; i < comment.Logs.Count; i++)
                {
                    comment.Logs[i].UserId = comment.Logs[i].User.UserId;
                    comment.Logs[i].User = null;
                }
                _context.Update(comment);
                await _context.SaveChangesAsync();
                myResponse.Status = Status.Success;
                myResponse.Message = "Comentario activado correctamente.";
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
