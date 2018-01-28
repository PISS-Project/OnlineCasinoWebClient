using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;

namespace OnlineCasinoWebClient.Helpers
{
    public static class RequestHelper
    {
        private static readonly string DomainName = "http://ocwebapi.azurewebsites.net/";

        public static HttpRequestMessage GenerateRequestMessage(string url, HttpMethod method, string token = null, object json = null)
        {
            var request = new HttpRequestMessage
            {
                RequestUri = new Uri(DomainName + url),
                Method = method
            };

            if (token != null)
                request.Headers.Add("OnlineCasino-Token", token);

            if (json != null)
                request.Content = new StringContent(JsonConvert.SerializeObject(json), Encoding.UTF8, "application/json");

            return request;
        }
    }
}