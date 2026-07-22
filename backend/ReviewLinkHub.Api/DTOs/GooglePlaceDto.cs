namespace ReviewLinkHub.Api.DTOs;

// Google'a gönderdiğimiz istek gövdesi
public class GoogleTextSearchRequest
{
    public string TextQuery { get; set; } = string.Empty;
}

// Google'ın döndürdüğü tek bir işletme kaydı
public class GooglePlaceResult
{
    public string Id { get; set; } = string.Empty;
    public GoogleDisplayName? DisplayName { get; set; }
    public string? FormattedAddress { get; set; }
    public string? GoogleMapsUri { get; set; }
}

public class GoogleDisplayName
{
    public string Text { get; set; } = string.Empty;
}

// Google'ın döndürdüğü tüm cevap (bir liste "places" alanı içinde gelir)
public class GoogleTextSearchResponse
{
    public List<GooglePlaceResult> Places { get; set; } = new();
}

// Bizim frontend'e döndüreceğimiz, sadeleştirilmiş DTO
public class BusinessSearchResultDto
{
    public string PlaceId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string FormattedAddress { get; set; } = string.Empty;
    public string? GoogleMapsUrl { get; set; }
}