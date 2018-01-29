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
using OnlineCasinoWebClient.Models;

namespace OnlineCasinoWebClient.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public async Task<ActionResult> Index()
        {
            var cookies = HttpContext.Request.Cookies;
            var lId = cookies["loginId"];
            var uId = cookies["userId"];
            var token = cookies["token"];

            if (lId != null && uId != null && token != null)
            {
                if (int.TryParse(lId.Value, out int loginId)
                    && int.TryParse(uId.Value, out int userId))
                {
                    var user = Session["user"] as UserModel;
                    // If we don't have user data, get it
                    if (user == null)
                    {
                        using (var client = new HttpClient())
                        {
                            var userModel = new UserModel();

                            var request = RequestHelper.GenerateRequestMessage($"api/users/{userId}", HttpMethod.Get, token: token.Value);
                            var response = await client.SendAsync(request);
                            var statusCode = response.StatusCode;

                            if (statusCode == HttpStatusCode.OK)
                            {
                                var cnt = await response.Content.ReadAsStringAsync();
                                var profileData = JsonConvert.DeserializeObject<UserProfileResponse>(cnt);

                                request = RequestHelper.GenerateRequestMessage($"api/users/{userId}/wallet", HttpMethod.Get, token: token.Value);
                                response = await client.SendAsync(request);
                                statusCode = response.StatusCode;

                                if (statusCode == HttpStatusCode.OK)
                                {
                                    cnt = await response.Content.ReadAsStringAsync();
                                    var walletData = JsonConvert.DeserializeObject<UserWalletResponse>(cnt);

                                    // Add user data to the session
                                    user = new UserModel()
                                    {
                                        LoginId = loginId,
                                        UserId = userId,
                                        Token = token.Value,
                                        Username = profileData.Username,
                                        FullName = profileData.FullName,
                                        Email = profileData.Email,
                                        Money = walletData.Balance
                                    };

                                    Session["user"] = user;
                                    return await Task.FromResult(View("Home", user));
                                }
                            }
                        }
                    }
                    else // check if user data corresponds to the cookies
                    {
                        if (user.LoginId == loginId 
                            && user.UserId == userId
                            && user.Token.Equals(token.Value))
                        {
                            return await Task.FromResult(View("Home", user));
                        }
                    }                    
                }

                // Error in cookie data
                ViewBag.Message = "Invalid cookies. Please login again!";
                foreach (var cookie in cookies.AllKeys)
                {
                    HttpContext.Response.Cookies[cookie].Expires = DateTime.Now.AddDays(-1);
                }
            }

            // If not logged in or invalid cookie data, go to login screen
            return await Task.FromResult(View("Index", "~/Views/Shared/_AuthenticationLayout.cshtml"));
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
                    ViewBag.Message = "Error occurred while trying to create an account!";
                    return await Task.FromResult(View("Index", "~/Views/Shared/_AuthenticationLayout.cshtml"));
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginRequest loginRequest, bool remember)
        {
            using (var client = new HttpClient())
            {
                var request = RequestHelper.GenerateRequestMessage("api/logins", HttpMethod.Post, json: loginRequest);
                var response = await client.SendAsync(request);
                var statusCode = response.StatusCode;

                if (statusCode == HttpStatusCode.Created)
                {
                    var cnt = await response.Content.ReadAsStringAsync();
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

                    return await Task.FromResult(RedirectToAction("Index", "Home"));
                }
                else
                {
                    ViewBag.Message = "Authorization failed. Please enter valid account info!";
                    return await Task.FromResult(View("Index", "~/Views/Shared/_AuthenticationLayout.cshtml"));
                }
            }
        }

        public async Task<ActionResult> Logout()
        {
            var cookies = HttpContext.Request.Cookies;
            var lId = cookies["loginId"];
            var uId = cookies["userId"];
            var token = cookies["token"];

            if (lId != null && uId != null && token != null)
            {
                if (int.TryParse(lId.Value, out int loginId)
                    && int.TryParse(uId.Value, out int userId))
                {
                    using (var client = new HttpClient())
                    {
                        var request = RequestHelper.GenerateRequestMessage($"api/logins/{loginId}", HttpMethod.Delete, token: token.Value);
                        var response = await client.SendAsync(request);
                        var statusCode = response.StatusCode;

                        if (statusCode == HttpStatusCode.NoContent)
                        {
                            Session.RemoveAll();
                            foreach (var cookie in cookies.AllKeys)
                            {
                                HttpContext.Response.Cookies[cookie].Expires = DateTime.Now.AddDays(-1);
                            }
                            return await Task.FromResult(RedirectToAction("Index", "Home"));
                        }
                    }
                }
            }

            Session.RemoveAll();
            ViewBag.Message = "Invalid cookies. Please try again!";
            return await Task.FromResult(RedirectToAction("Index", "Home"));
        }
    }
}