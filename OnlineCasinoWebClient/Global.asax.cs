using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace OnlineCasinoWebClient
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }

        public void Application_Error(Object sender, EventArgs e)
        {
            Exception exception = Server.GetLastError();
            Server.ClearError();

            if (exception.GetType() == typeof(HttpException))
            {
                if (((HttpException)exception).GetHttpCode() == 404)
                {
                    Response.Redirect("/Error/NotFound");
                    return;
                }
            }

            Response.Redirect("/Error");
        }
    }
}
