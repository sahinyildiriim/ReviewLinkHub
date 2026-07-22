using Microsoft.AspNetCore.Mvc;
using ReviewLinkHub.Api.DTOs;
using ReviewLinkHub.Api.Services;

namespace ReviewLinkHub.Api.Controllers;

[ApiController]
[Route("api/businesses")]
public class BusinessesController : ControllerBase
{
    private readonly IGooglePlacesService _googlePlacesService;

    public BusinessesController(IGooglePlacesService googlePlacesService)
    {
        _googlePlacesService = googlePlacesService;
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<BusinessSearchResultDto>>> Search(
        [FromQuery] string query,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest("Arama sorgusu boş olamaz.");
        }

        var results = await _googlePlacesService.SearchAsync(query, cancellationToken);
        return Ok(results);
    }
}