using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReviewLinkHub.Api.Data;
using ReviewLinkHub.Api.DTOs;
using ReviewLinkHub.Api.Models;
using ReviewLinkHub.Api.Services;


namespace ReviewLinkHub.Api.Controllers;

[ApiController]
[Route("api/review-requests")]
public class ReviewRequestsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IQrCodeService _qrCodeService;
    private readonly IReviewLinkService _reviewLinkService;

    public ReviewRequestsController(
        AppDbContext context,
        IQrCodeService qrCodeService,
        IReviewLinkService reviewLinkService)
    {
        _context = context;
        _qrCodeService = qrCodeService;
        _reviewLinkService = reviewLinkService;
    }


    [HttpPost]
    public async Task<ActionResult<ReviewRequestResponseDto>> Create(CreateReviewRequestDto dto)
    {
        // 1. Business zaten var mı kontrol et (artık GooglePlaceId üzerinden — gerçek unique key)
        var business = await _context.Businesses
            .FirstOrDefaultAsync(b => b.GooglePlaceId == dto.PlaceId);

        if (business == null)
        {
            business = new Business
            {
                Id = Guid.NewGuid(),
                GooglePlaceId = dto.PlaceId,
                Name = dto.BusinessName,
                FormattedAddress = dto.BusinessAddress,
                GoogleMapsUrl = dto.GoogleMapsUrl,
                CreatedAtUtc = DateTime.UtcNow
            };
            _context.Businesses.Add(business);
        }
        else
        {
            // Zaten vardı — güncel bilgilerle tazele
            business.Name = dto.BusinessName;
            business.FormattedAddress = dto.BusinessAddress;
            business.GoogleMapsUrl = dto.GoogleMapsUrl;
        }

        // 2. Review linkini artık ReviewLinkService ile üret
        var reviewUrl = _reviewLinkService.Create(business.GooglePlaceId);

        // 3. ReviewRequest oluştur
        var reviewRequest = new ReviewRequest
        {
            Id = Guid.NewGuid(),
            BusinessId = business.Id,
            Business = business,
            RecipientName = dto.RecipientName,
            RecipientEmail = dto.RecipientEmail,
            ReviewUrl = reviewUrl,
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.ReviewRequests.Add(reviewRequest);
        await _context.SaveChangesAsync();

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
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<ReviewRequestResponseDto>>> GetAll(
    [FromQuery] string? search,
    [FromQuery] string? status,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20)
    {
        var query = _context.ReviewRequests
            .Include(r => r.Business)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(r =>
                r.Business.Name.Contains(search) ||
                r.RecipientEmail.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(r => r.Status == status);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(r => r.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new ReviewRequestResponseDto
            {
                Id = r.Id,
                BusinessName = r.Business.Name,
                ReviewUrl = r.ReviewUrl,
                Status = r.Status,
                CreatedAtUtc = r.CreatedAtUtc
            })
            .ToListAsync();

        return new PagedResultDto<ReviewRequestResponseDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }
    [HttpGet("{id}/qr-code")]
    public async Task<IActionResult> GetQrCode(Guid id)
    {
        var reviewRequest = await _context.ReviewRequests.FindAsync(id);

        if (reviewRequest == null)
        {
            return NotFound();
        }

        var qrBytes = _qrCodeService.GeneratePng(reviewRequest.ReviewUrl);
        return File(qrBytes, "image/png", $"review-qr-{id}.png");
    }

}