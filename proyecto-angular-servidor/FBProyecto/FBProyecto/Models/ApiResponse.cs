using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    public enum Status
    {
        Success = 0,
        NotFound = 1,
        Error = 2,
    }
    public class ApiResponse
    {
        public Status Status { get; set; }
        public string Message { get; set; }
        public Object Data { get; set; }
    }
}
