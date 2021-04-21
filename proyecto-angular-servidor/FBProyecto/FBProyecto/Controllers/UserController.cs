using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;

namespace FBProyecto.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        // GET: api/<UserController>
        [HttpGet]
        public string Get()
        {
            return AccountHelper.GetWinAuthAccount(HttpContext);
        }
    }

    public class AccountHelper
    {
        public static string GetWinAuthAccount(HttpContext context)
        {
            IPrincipal p = context.User;
            return p.Identity.Name;
        }
    }
}
