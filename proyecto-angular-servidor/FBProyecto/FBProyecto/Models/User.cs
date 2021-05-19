using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
   
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Username { get; set; }
        [Required]
        public String Rol { get; set; }

        public ICollection<Log> Logs { get; set; }
    }
}
