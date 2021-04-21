using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    public class Comentario
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int IdComentario { get; set; }
        [Required]
        public string Usuario { get; set; }
        [Required]
        public string Ruta { get; set; }
        [Required]
        public string Texto { get; set; }
        [Required]
        public DateTime FechaAlta { get; set; }
        public DateTime? FechaBaja { get; set; }
    }
}
