using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    [Keyless]
    public class CommentLog
    {
        public DateTime Date { get; set; }
        public string Path { get; set; }
        public Action Action { get; set; }
        public string Username { get; set; }

    }
}
