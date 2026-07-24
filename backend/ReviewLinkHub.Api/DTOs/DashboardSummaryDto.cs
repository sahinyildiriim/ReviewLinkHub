namespace ReviewLinkHub.Api.DTOs;

public class DashboardSummaryDto
{
    public int TotalRequests { get; set; }
    public int SentCount { get; set; }
    public int FailedCount { get; set; }
    public int PendingCount { get; set; }
    public double SuccessRate { get; set; }
    public List<DailyTrendPointDto> DailyTrend { get; set; } = new();
}

public class DailyTrendPointDto
{
    public DateOnly Date { get; set; }
    public int SentCount { get; set; }
    public int FailedCount { get; set; }
}