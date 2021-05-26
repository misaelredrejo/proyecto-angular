using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    public class UserLog
    {
        [Key]
        public int UserLogId { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public Log Log { get; set; }
        [Required]
        public bool Read { get; set; }
    }
}
