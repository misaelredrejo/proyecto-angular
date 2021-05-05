using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    public enum Rol
    {
        Desarrollador = 0,
        Otro = 1
    }
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Username { get; set; }
        [Required]
        public Rol Rol { get; set; }
    }
}
