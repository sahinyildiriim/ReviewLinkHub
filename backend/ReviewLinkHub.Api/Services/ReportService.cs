using ClosedXML.Excel;
using ReviewLinkHub.Api.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
namespace ReviewLinkHub.Api.Services;

public class ReportService : IReportService
{
    private static readonly TimeZoneInfo TurkeyTimeZone =
        TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");

    private static string FormatLocal(DateTime utc) =>
        TimeZoneInfo.ConvertTimeFromUtc(utc, TurkeyTimeZone).ToString("yyyy-MM-dd HH:mm");

    public byte[] GenerateExcel(List<ReviewRequest> reviewRequests)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Review Requests");

        // Başlık satırı
        worksheet.Cell(1, 1).Value = "ID";
        worksheet.Cell(1, 2).Value = "İşletme";
        worksheet.Cell(1, 3).Value = "E-posta";
        worksheet.Cell(1, 4).Value = "Durum";
        worksheet.Cell(1, 5).Value = "Tarih";
        worksheet.Cell(1, 6).Value = "Hata";

        worksheet.Row(1).Style.Font.Bold = true;

        // Veri satırları
        for (int i = 0; i < reviewRequests.Count; i++)
        {
            var r = reviewRequests[i];
            var row = i + 2; // 1. satır başlık olduğu için 2'den başlıyoruz

            worksheet.Cell(row, 1).Value = r.Id.ToString();
            worksheet.Cell(row, 2).Value = r.Business.Name;
            worksheet.Cell(row, 3).Value = r.RecipientEmail;
            worksheet.Cell(row, 4).Value = r.Status;
            worksheet.Cell(row, 5).Value = FormatLocal(r.CreatedAtUtc);
            worksheet.Cell(row, 6).Value = r.LastErrorMessage ?? "";
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    public byte[] GeneratePdf(List<ReviewRequest> reviewRequests)
    {
        var totalCount = reviewRequests.Count;
        var sentCount = reviewRequests.Count(r => r.Status == "Sent");
        var failedCount = reviewRequests.Count(r => r.Status == "Failed");
        var successRate = totalCount > 0 ? (sentCount * 100.0 / totalCount) : 0;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Text("Review Request Raporu").FontSize(18).Bold();

                page.Content().Column(column =>
                {
                    // Özet metrikler
                    column.Item().PaddingTop(10).Text($"Toplam talep: {totalCount}");
                    column.Item().Text($"Başarılı: {sentCount}");
                    column.Item().Text($"Başarısız: {failedCount}");
                    column.Item().Text($"Başarı oranı: %{successRate:F1}");

                    // Detay tablosu
                    column.Item().PaddingTop(20).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(2); // İşletme
                            columns.RelativeColumn(2); // E-posta
                            columns.RelativeColumn(1); // Durum
                            columns.RelativeColumn(2); // Tarih
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(6).Text("İşletme").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(6).Text("E-posta").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(6).Text("Durum").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(6).Text("Tarih").Bold();
                        });

                        for (int i = 0; i < reviewRequests.Count; i++)
                        {
                            var r = reviewRequests[i];
                            var backgroundColor = i % 2 == 0 ? Colors.White : Colors.Grey.Lighten3;

                            table.Cell().Background(backgroundColor).Padding(6).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Text(r.Business.Name);
                            table.Cell().Background(backgroundColor).Padding(6).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Text(r.RecipientEmail);
                            table.Cell().Background(backgroundColor).Padding(6).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Text(r.Status);
                            table.Cell().Background(backgroundColor).Padding(6).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten1).Text(FormatLocal(r.CreatedAtUtc));
                        }
                    });
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }
}