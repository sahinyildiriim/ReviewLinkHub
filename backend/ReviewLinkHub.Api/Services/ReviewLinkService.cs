namespace ReviewLinkHub.Api.Services;

public class ReviewLinkService : IReviewLinkService
{
    public string Create(string placeId)
    {
        return $"https://search.google.com/local/writereview?placeid={placeId}";
    }
}