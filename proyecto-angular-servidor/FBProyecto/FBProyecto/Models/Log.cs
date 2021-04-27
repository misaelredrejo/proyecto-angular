using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    public enum Action
    {
        Añadir = 0,
        Modificar = 1,
        Eliminar = 2,
        Activar = 3
    }
    public class Log
    {
        
        [Key]
        public int LogId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public User User { get; set; }
        public DateTime Date { get; set; }
        [Required]
        public Action Action { get; set; }
    }
}
