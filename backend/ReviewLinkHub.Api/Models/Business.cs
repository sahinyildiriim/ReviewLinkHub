namespace ReviewLinkHub.Api.Models
{
    public class Business
    {
        public Guid Id { get; set; }
        public string GooglePlaceId { get; set; } = string.Empty;
        public required string Name { get; set; }

        public string FormattedAddress { get; set; } = string.Empty;
        public string? GoogleMapsUrl    { get; set; }

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
