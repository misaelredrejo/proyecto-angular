using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    public class FilterQuery
    {
        public string Username { get; set; }
        public Action Action { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
