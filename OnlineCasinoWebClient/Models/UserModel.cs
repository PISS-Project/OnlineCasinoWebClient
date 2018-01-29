namespace OnlineCasinoWebClient.Models
{
    public class UserModel
    {
        public int LoginId { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public decimal Money { get; set; }
    }
}