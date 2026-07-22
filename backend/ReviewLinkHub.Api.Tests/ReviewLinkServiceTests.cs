using ReviewLinkHub.Api.Services;
using Xunit;

namespace ReviewLinkHub.Api.Tests;

public class ReviewLinkServiceTests
{
    [Fact]
    public void Create_ReturnsCorrectGoogleReviewUrl()
    {
        // Arrange
        var service = new ReviewLinkService();
        var placeId = "ChIJkUZBGjy5yhQR4BkbnGQH9DE";

        // Act
        var result = service.Create(placeId);

        // Assert
        Assert.Equal("https://search.google.com/local/writereview?placeid=ChIJkUZBGjy5yhQR4BkbnGQH9DE", result);
    }
}