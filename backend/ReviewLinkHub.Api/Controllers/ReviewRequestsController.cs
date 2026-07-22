using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReviewLinkHub.Api.Data;
using ReviewLinkHub.Api.DTOs;
using ReviewLinkHub.Api.Models;

namespace ReviewLinkHub.Api.Controllers;

[ApiController]
[Route("api/review-requests")]
public class ReviewRequestsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewRequestsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<ReviewRequestResponseDto>> Create(CreateReviewRequestDto dto)
    {
        // 1. Business zaten var mı kontrol et (aynı isim+adres), yoksa oluştur
        var business = await _context.Businesses
            .FirstOrDefaultAsync(b => b.Name == dto.BusinessName && b.FormattedAddress == dto.BusinessAddress);

        if (business == null)
        {
            business = new Business
            {
                Id = Guid.NewGuid(),
                GooglePlaceId = $"FAKE-{Guid.NewGuid()}", // Google entegrasyonu gelene kadar sahte
                Name = dto.BusinessName,
                FormattedAddress = dto.BusinessAddress,
                CreatedAtUtc = DateTime.UtcNow
            };
            _context.Businesses.Add(business);
        }

        // 2. ReviewRequest oluştur
        var reviewRequest = new ReviewRequest
        {
            Id = Guid.NewGuid(),
            BusinessId = business.Id,
            Business = business,
            RecipientName = dto.RecipientName,
            RecipientEmail = dto.RecipientEmail,
            ReviewUrl = $"https://search.google.com/local/writereview?placeid={business.GooglePlaceId}",
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.ReviewRequests.Add(reviewRequest);

        // 3. Veritabanına yaz
        await _context.SaveChangesAsync();

        // 4. Response DTO'ya çevirip döndür
        var response = new ReviewRequestResponseDto
        {
            Id = reviewRequest.Id,
            BusinessName = business.Name,
            ReviewUrl = reviewRequest.ReviewUrl,
            Status = reviewRequest.Status,
            CreatedAtUtc = reviewRequest.CreatedAtUtc
        };

        return CreatedAtAction(nameof(GetById), new { id = reviewRequest.Id }, response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewRequestResponseDto>> GetById(Guid id)
    {
        var reviewRequest = await _context.ReviewRequests
            .Include(r => r.Business)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reviewRequest == null)
        {
            return NotFound();
        }

        return new ReviewRequestResponseDto
        {
            Id = reviewRequest.Id,
            BusinessName = reviewRequest.Business.Name,
            ReviewUrl = reviewRequest.ReviewUrl,
            Status = reviewRequest.Status,
            CreatedAtUtc = reviewRequest.CreatedAtUtc
        };
    }
}