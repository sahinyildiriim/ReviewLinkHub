using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using ReviewLinkHub.Api.Options;

namespace ReviewLinkHub.Api.Services;

public class EmailService : IEmailService
{
    private readonly EmailOptions _options;

    public EmailService(IOptions<EmailOptions> options)
    {
        _options = options.Value;
    }

    public async Task SendReviewQrEmailAsync(
        string recipientName,
        string recipientEmail,
        string businessName,
        string reviewUrl,
        byte[] qrCodePng,
        CancellationToken cancellationToken)
    {
        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(_options.SmtpUser));
        message.To.Add(MailboxAddress.Parse(recipientEmail));
        message.Subject = $"{businessName} için değerlendirme talebi";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <p>Merhaba {recipientName},</p>
                <p><strong>{businessName}</strong> için bir Google değerlendirme talebiniz var.</p>
                <p>Aşağıdaki bağlantıya tıklayarak veya ekteki QR kodu tarayarak değerlendirme yapabilirsiniz:</p>
                <p><a href=""{reviewUrl}"">{reviewUrl}</a></p>
                <p>Teşekkürler.</p>"
        };

        bodyBuilder.Attachments.Add("review-qr.png", qrCodePng, new ContentType("image", "png"));
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(_options.SmtpHost, _options.SmtpPort, SecureSocketOptions.StartTls, cancellationToken);
        await client.AuthenticateAsync(_options.SmtpUser, _options.SmtpPassword, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}