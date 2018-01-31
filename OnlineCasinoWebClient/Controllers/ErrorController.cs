using System.Net;
using System.Web.Mvc;

namespace OnlineCasinoWebClient.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Error
        public ActionResult Index()
        {
            Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            Response.TrySkipIisCustomErrors = true;
            return View("Error", "_ErrorLayout");
        }

        public ActionResult NotFound()
        {
            Response.StatusCode = (int)HttpStatusCode.NotFound;
            Response.TrySkipIisCustomErrors = true;
            HttpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
            HttpContext.Response.TrySkipIisCustomErrors = true;
            return View("NotFound", "_ErrorLayout");
        }
    }
}