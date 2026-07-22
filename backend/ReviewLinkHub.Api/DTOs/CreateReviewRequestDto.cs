namespace ReviewLinkHub.Api.DTOs
{
    public class CreateReviewRequestDto
    {
        public string PlaceId { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public string BusinessAddress { get; set; } = string.Empty;
        public string? GoogleMapsUrl { get; set; }
        public string RecipientName { get; set; } = string.Empty;
        public string RecipientEmail { get; set; } = string.Empty;
    }

}