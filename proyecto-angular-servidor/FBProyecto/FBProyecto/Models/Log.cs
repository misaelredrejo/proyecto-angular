using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    public enum Action
    {
        Aniadir = 0,
        Modificar = 1,
        Eliminar = 2,
        Activar = 3
    }
    public class Log
    {
        
        [Key]
        public int LogId { get; set; }
        [Required]
        public int CommentId { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public string CommentText { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public Action Action { get; set; }
    }
}
