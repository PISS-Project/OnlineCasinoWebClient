﻿using Newtonsoft.Json;
using OnlineCasinoWebClient.Helpers;
using OnlineCasinoWebClient.Models;
using OnlineCasinoWebClient.Requests;
using OnlineCasinoWebClient.Responses;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace OnlineCasinoWebClient.Controllers
{
    public class ProfileController : Controller
    {
        // GET: User
        public async Task<ActionResult> Index()
        {
            var user = Session["user"] as UserModel;
            if (user == null)
                return await Task.FromResult(View("~/Views/Home/Index.cshtml", "~/Views/Shared/_AuthenticationLayout.cshtml"));

            return await Task.FromResult(View("Index", user));
        }

        [ChildActionOnly]
        public async Task<ActionResult> UserProfile()
        {
            var user = Session["user"] as UserModel;

            return await Task.FromResult(PartialView("_UserProfile", user));
        }

        public async Task<ActionResult> Edit()
        {
            return await Task.FromResult(View("Edit"));
        }

        [HttpPost]
        public async Task<ActionResult> Edit(EditProfileDataRequest editRequest)
        {
            var user = Session["user"] as UserModel;
            if (user == null)
                return await Task.FromResult(View("~/Views/Home/Index.cshtml", "~/Views/Shared/_AuthenticationLayout.cshtml"));

            using (var client = new HttpClient())
            {
                var request = RequestHelper.GenerateRequestMessage($"api/users/{user.UserId}/profile", HttpMethod.Put, user.Token, json: editRequest);
                var response = await client.SendAsync(request);
                var statusCode = response.StatusCode;

                var cnt = await response.Content.ReadAsStringAsync();
                var newUserData = JsonConvert.DeserializeObject<UserEditResponse>(cnt);

                if (statusCode == HttpStatusCode.OK)
                {
                    // Add new user data to the session
                    var newUser = new UserModel()
                    {
                        LoginId = user.LoginId,
                        UserId = newUserData.UserId,
                        Token = user.Token,
                        Username = user.Username,
                        FullName = newUserData.FullName,
                        Email = newUserData.Email,
                        Money = user.Money
                    };

                    Session["user"] = newUser;

                    TempData["message"] = "Profile was successfully updated!";
                    return await Task.FromResult(View("Index"));
                }
                else
                {
                    TempData["message"] = "Error occurred while trying to change your password!";
                    return await Task.FromResult(View("Index"));
                }
            }
        }

        public async Task<ActionResult> ChangePassword()
        {
            return await Task.FromResult(View("ChangePassword"));
        }

        [HttpPost]
        public async Task<ActionResult> ChangePassword(ChangePasswordRequest changePasswordRequest)
        {
            var user = Session["user"] as UserModel;
            if (user == null)
                return await Task.FromResult(View("~/Views/Home/Index.cshtml", "~/Views/Shared/_AuthenticationLayout.cshtml"));

            using (var client = new HttpClient())
            {
                var request = RequestHelper.GenerateRequestMessage($"api/users/{user.UserId}/password", HttpMethod.Put, token: user.Token, json: changePasswordRequest);
                var response = await client.SendAsync(request);
                var statusCode = response.StatusCode;

                if (statusCode == HttpStatusCode.NoContent)
                {
                    // should we do something with the session and cookies?
                    TempData["message"] = "Password was successfully changed!";
                    return await Task.FromResult(View("Index"));
                }
                else
                {
                    TempData["message"] = "Error occurred while trying to change your password!";
                    return await Task.FromResult(View("Index"));
                }
            }
        }

        public async Task<ActionResult> Deposit()
        {
            return await Task.FromResult(View("Deposit"));
        }

        [HttpPost]
        public async Task<ActionResult> Deposit(DepositRequest depositRequest)
        {
            var user = Session["user"] as UserModel;
            if (user == null)
                return await Task.FromResult(View("~/Views/Home/Index.cshtml", "~/Views/Shared/_AuthenticationLayout.cshtml"));

            using (var client = new HttpClient())
            {
                var request = RequestHelper.GenerateRequestMessage($"api/users/{user.UserId}/wallet", HttpMethod.Put, token: user.Token, json: depositRequest);
                var response = await client.SendAsync(request);
                var statusCode = response.StatusCode;

                if (statusCode == HttpStatusCode.OK)
                {
                    var cnt = await response.Content.ReadAsStringAsync();
                    var newBalanceInfo = JsonConvert.DeserializeObject<DepositResponse>(cnt);

                    // Add new user data to the session
                    var newUser = new UserModel()
                    {
                        LoginId = user.LoginId,
                        UserId = user.UserId,
                        Token = user.Token,
                        Username = user.Username,
                        FullName = user.FullName,
                        Email = user.Email,
                        Money = newBalanceInfo.Balance
                    };

                    Session["user"] = newUser;

                    TempData["message"] = $"{depositRequest.Addmoney} money had been successfully added in your wallet.";
                    return await Task.FromResult(RedirectToAction("Index"));
                }
                else
                {
                    TempData["message"] = "Error occurred while trying to delete your account!";
                    return await Task.FromResult(View("Index"));
                }
            }
        }

        public async Task<ActionResult> Delete(DeleteAccountRequest deleteAccountRequest)
        {
            var user = Session["user"] as UserModel;
            if (user == null)
                return await Task.FromResult(View("~/Views/Home/Index.cshtml", "~/Views/Shared/_AuthenticationLayout.cshtml"));

            using (var client = new HttpClient())
            {
                var request = RequestHelper.GenerateRequestMessage($"api/users/{user.UserId}", HttpMethod.Delete, token: user.Token, json: deleteAccountRequest);
                var response = await client.SendAsync(request);
                var statusCode = response.StatusCode;

                if (statusCode == HttpStatusCode.NoContent)
                {
                    Session["user"] = null;
                    TempData["message"] = "Your account was successfully deleted.";
                    return await Task.FromResult(RedirectToAction("Index"));
                }
                else
                {
                    TempData["message"] = "Error occurred while trying to delete your account!";
                    return await Task.FromResult(RedirectToAction("Index"));
                }
            }
        }
    }
}