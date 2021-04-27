using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }
        [Required]
        public string Path { get; set; }
        [Required]
        public string Text { get; set; }
        [Required]
        public IList<Log> Logs { get; set; }
        [Required]
        public bool IsActive { get; set; }
    }
}
