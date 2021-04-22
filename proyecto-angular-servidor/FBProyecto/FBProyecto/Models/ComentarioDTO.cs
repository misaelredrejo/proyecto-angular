using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    public class ComentarioDTO
    {
        [Key]
        public int Id { get; set; }
        public string Usuario { get; set; }
        public string Ruta { get; set; }
        public string Texto { get; set; }
        public DateTime? FechaAlta { get; set; }
        public string Accion { get; set; }
    }
}
