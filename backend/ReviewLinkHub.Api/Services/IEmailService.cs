namespace ReviewLinkHub.Api.Services;

public interface IEmailService
{
    Task SendReviewQrEmailAsync(string recipientName, string recipientEmail, string businessName, string reviewUrl, byte[] qrCodePng, CancellationToken cancellationToken);
}