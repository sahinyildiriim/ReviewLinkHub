namespace ReviewLinkHub.Api.Models
{
    public class ReviewRequest
    {

        public Guid Id { get; set; }

        public Guid BusinessId { get; set; }
        public Business Business { get; set; } = null!;

        public string RecipientName { get; set; } = string.Empty;
        public string RecipientEmail { get; set ; } = string.Empty;
        public string ReviewUrl { get; set; } = string.Empty;

        public string Status { get; set; } = "Pending";
        public string? LastErrorMessage { get; set; }
        public int RetryCount { get; set; } = 0;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? SentAtUtc { get; set; }


    }
}
