using FBProyecto.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Comment> Comment { get; set; }
        public DbSet<CommentLog> CommentLog { get; set; }
        public DbSet<Log> Log { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<UserLog> UserLog { get; set; }
    }
}
