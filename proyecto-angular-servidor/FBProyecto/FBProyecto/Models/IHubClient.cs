using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FBProyecto.Models
{
    public interface IHubClient
    {
        Task BroadcastMessage();
    }
}
