namespace ReviewLinkHub.Api.DTOs
{
    public class ReviewRequestResponseDto
    {

        public Guid Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string ReviewUrl { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAtUtc { get; set; }
    }
}
