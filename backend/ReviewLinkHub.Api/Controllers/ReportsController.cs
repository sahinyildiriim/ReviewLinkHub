using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReviewLinkHub.Api.Data;
using ReviewLinkHub.Api.Services;

namespace ReviewLinkHub.Api.Controllers;

[ApiController]
[Route("api/reports/review-requests")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IReportService _reportService;

    public ReportsController(AppDbContext context, IReportService reportService)
    {
        _context = context;
        _reportService = reportService;
    }

    [HttpGet("excel")]
    public async Task<IActionResult> GetExcel([FromQuery] string? search, [FromQuery] string? status)
    {
        var reviewRequests = await GetFilteredRequests(search, status);
        var fileBytes = _reportService.GenerateExcel(reviewRequests);

        return File(
            fileBytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"review-requests-{DateTime.UtcNow:yyyyMMdd}.xlsx");
    }

    [HttpGet("pdf")]
    public async Task<IActionResult> GetPdf([FromQuery] string? search, [FromQuery] string? status)
    {
        var reviewRequests = await GetFilteredRequests(search, status);
        var fileBytes = _reportService.GeneratePdf(reviewRequests);

        return File(
            fileBytes,
            "application/pdf",
            $"review-requests-{DateTime.UtcNow:yyyyMMdd}.pdf");
    }

    private async Task<List<Models.ReviewRequest>> GetFilteredRequests(string? search, string? status)
    {
        var query = _context.ReviewRequests.Include(r => r.Business).AsQueryable();

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

        return await query.OrderByDescending(r => r.CreatedAtUtc).ToListAsync();
    }
}