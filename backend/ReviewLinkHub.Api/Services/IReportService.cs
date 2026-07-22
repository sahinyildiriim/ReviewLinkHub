using ReviewLinkHub.Api.Models;

namespace ReviewLinkHub.Api.Services;

public interface IReportService
{
    byte[] GenerateExcel(List<ReviewRequest> reviewRequests);
    byte[] GeneratePdf(List<ReviewRequest> reviewRequests);
}