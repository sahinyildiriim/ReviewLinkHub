using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using ReviewLinkHub.Api.DTOs;
using ReviewLinkHub.Api.Options;

namespace ReviewLinkHub.Api.Services;

public class GooglePlacesService : IGooglePlacesService
{
    private readonly HttpClient _httpClient;
    private readonly GooglePlacesOptions _options;

    public GooglePlacesService(HttpClient httpClient, IOptions<GooglePlacesOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<List<BusinessSearchResultDto>> SearchAsync(string query, CancellationToken cancellationToken)
    {
        var requestBody = new GoogleTextSearchRequest
        {
            TextQuery = query,
            MaxResultCount = 5
        };
        var json = JsonSerializer.Serialize(requestBody, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://places.googleapis.com/v1/places:searchText")
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

        request.Headers.Add("X-Goog-Api-Key", _options.ApiKey);
        request.Headers.Add("X-Goog-FieldMask", "places.id,places.displayName,places.formattedAddress,places.googleMapsUri");

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new HttpRequestException($"Google API error ({response.StatusCode}): {errorBody}");
        }

        var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);
        var result = JsonSerializer.Deserialize<GoogleTextSearchResponse>(responseJson, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (result?.Places == null)
        {
            return new List<BusinessSearchResultDto>();
        }

        return result.Places.Select(p => new BusinessSearchResultDto
        {
            PlaceId = p.Id,
            Name = p.DisplayName?.Text ?? string.Empty,
            FormattedAddress = p.FormattedAddress ?? string.Empty,
            GoogleMapsUrl = p.GoogleMapsUri
        }).ToList();
    }
}