using System.ComponentModel.DataAnnotations;

namespace ReviewLinkHub.Api.DTOs;

public class CreateReviewRequestDto
{
    [Required]
    public string PlaceId { get; set; } = string.Empty;

    [Required]
    public string BusinessName { get; set; } = string.Empty;

    [Required]
    public string BusinessAddress { get; set; } = string.Empty;

    public string? GoogleMapsUrl { get; set; }

    [Required]
    public string RecipientName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string RecipientEmail { get; set; } = string.Empty;
}