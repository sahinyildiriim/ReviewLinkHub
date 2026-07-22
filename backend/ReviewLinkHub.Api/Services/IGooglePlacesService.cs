using ReviewLinkHub.Api.DTOs;

namespace ReviewLinkHub.Api.Services;

public interface IGooglePlacesService
{
    Task<List<BusinessSearchResultDto>> SearchAsync(string query, CancellationToken cancellationToken);
}