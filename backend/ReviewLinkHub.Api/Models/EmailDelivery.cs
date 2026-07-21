namespace ReviewLinkHub.Api.Models
{
    public class EmailDelivery
    {
        public Guid Id { get; set; }
        public Guid ReviewRequestId { get; set; }

        public ReviewRequest ReviewRequest { get; set; } = null!;
        public string Status { get; set; } = "Pending";
         
        public DateTime AttemptedAtUtc { get; set; } 

        public string? ErrorMessage { get; set; }

        public string? ProviderMessageId { get; set; }
    }
}
