namespace ReviewLinkHub.Api.DTOs
{
    public class CreateReviewRequestDto
    {
        public string BusinessName { get; set; } = string.Empty;
        public string BusinessAddress { get; set; } = string.Empty;

        public string RecipientName { get; set; } = string.Empty;

        public string RecipientEmail { get; set; } = string.Empty;



    }

}