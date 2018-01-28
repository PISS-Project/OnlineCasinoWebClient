using OnlineCasinoWebClient.Helpers;
using OnlineCasinoWebClient.Requests;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Net;
using Newtonsoft.Json;
using OnlineCasinoWebClient.Responses;
using System.Web;
using System.Collections.Generic;
using System;

namespace OnlineCasinoWebClient.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public async Task<ActionResult> Index()
        {
            var loginIdCookie = HttpContext.Request.Cookies["loginId"];

            if (loginIdCookie != null)
            {
                int.TryParse(loginIdCookie.Value, out int loginId);
                return await Task.FromResult(View("Home"));
            }
            else
            {
                return await Task.FromResult(View("Index", "~/Views/Shared/_AuthenticationLayout.cshtml"));
            }
        }

        [HttpPost]
        public async Task<ActionResult> Register(RegisterRequest registerRequest, string confirmPassword)
        {
            using (var client = new HttpClient())
            {
                var request = RequestHelper.GenerateRequestMessage("api/users", HttpMethod.Post, json: registerRequest);

                var response = await client.SendAsync(request);

                var statusCode = response.StatusCode;
                if (statusCode == HttpStatusCode.Created)
                {
                    ViewBag.Message = "Account was created. Please login!";
                    return await Task.FromResult(View("Index", "~/Views/Shared/_AuthenticationLayout.cshtml"));
                }
                else if (statusCode == HttpStatusCode.Conflict)
                {
                    ViewBag.Message = "Username is already taken!";
                    return await Task.FromResult(View("Index", "~/Views/Shared/_AuthenticationLayout.cshtml"));
                }
                else
                {
                    ViewBag.Message = "Error occured while trying to create an account!";
                    return await Task.FromResult(View("Index", "~/Views/Shared/_AuthenticationLayout.cshtml"));
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> Login(string username, string password, bool remember)
        {
            var loginRequest = new
            {
                Username = username,
                Password = password
            };

            using (var client = new HttpClient())
            {
                var request = RequestHelper.GenerateRequestMessage("api/logins", HttpMethod.Post, json: loginRequest);

                var response = await client.SendAsync(request);

                var statusCode = response.StatusCode;

                if (statusCode == HttpStatusCode.Created)
                {
                    string cnt = await response.Content.ReadAsStringAsync();
                    var resp = JsonConvert.DeserializeObject<LoginResponse>(cnt);

                    var cookies = new List<HttpCookie>
                    {
                        new HttpCookie("loginId", resp.Id.ToString()),
                        new HttpCookie("userId", resp.UserId.ToString()),
                        new HttpCookie("token", resp.Token)
                    };

                    cookies.ForEach(x =>
                    {
                        if (remember) x.Expires = DateTime.Now.AddDays(30);
                        else x.Expires = DateTime.MinValue;

                        HttpContext.Response.AppendCookie(x);
                    });

                    return await Index();
                }
                else
                {
                    ViewBag.Message = "Authorization failed. Please enter valid account info!";
                    return await Task.FromResult(View("Index", "~/Views/Shared/_AuthenticationLayout.cshtml"));
                }
            }
        }
    }
}