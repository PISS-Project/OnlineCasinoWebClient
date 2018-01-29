using OnlineCasinoWebClient.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OnlineCasinoWebClient.Controllers
{
    public class ProfileController : Controller
    {
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        [ChildActionOnly]
        public ActionResult UserProfile()
        {
            var user = Session["user"] as UserModel;

            return PartialView("_UserProfile", user);
        }
    }
}