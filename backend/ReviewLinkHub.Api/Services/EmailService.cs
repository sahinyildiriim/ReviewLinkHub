using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Utils;
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

        var bodyBuilder = new BodyBuilder();

        // QR kodu inline (gömülü) resim olarak ekle, ek (attachment) olarak değil
        var qrImage = bodyBuilder.LinkedResources.Add("review-qr.png", qrCodePng, new ContentType("image", "png"));
        qrImage.ContentId = MimeUtils.GenerateMessageId();
        bodyBuilder.HtmlBody = $@"
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
</head>

<body style='margin:0;padding:32px;background:#F4F7FC;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;'>

<table role='presentation' cellpadding='0' cellspacing='0' width='100%'>
<tr>
<td align='center'>

<table role='presentation'
style='max-width:620px;width:100%;background:#ffffff;border-radius:20px;
overflow:hidden;border:1px solid #E5E7EB;
box-shadow:0 8px 30px rgba(0,0,0,.05);'>

<tr>
<td style='padding:30px;
background:linear-gradient(135deg,#2563EB,#3B82F6);'>

<span style='font-size:30px;'>🔗</span>

<span style='font-size:28px;
font-weight:700;
color:white;
margin-left:10px;'>
ReviewLinkHub
</span>

</td>
</tr>

<tr>

<td style='padding:40px;'>

<h2 style='margin:0;
font-size:30px;
color:#111827;'>
Merhaba {recipientName} 👋
</h2>

<p style='margin-top:20px;
font-size:17px;
line-height:1.7;
color:#4B5563;'>

<strong style='color:#2563EB;'>{businessName}</strong>
için bir değerlendirme talebiniz var.

<br><br>

Deneyiminizi Google üzerinden paylaşarak
bize destek olabilirsiniz.

</p>

<table role='presentation'
width='100%'
style='margin-top:35px;margin-bottom:35px;'>

<tr>

<td align='center'>

<a href='{reviewUrl}'
style='display:inline-block;
background:#2563EB;
padding:18px 38px;
border-radius:14px;
font-size:17px;
font-weight:700;
color:white;
text-decoration:none;'>

⭐ Google'da Değerlendir

</a>

</td>

</tr>

</table>

<table role='presentation'
width='100%'>

<tr>

<td align='center'>

<div style='color:#6B7280;
font-size:15px;
margin-bottom:20px;'>

veya

</div>

<div style='border:1px solid #E5E7EB;
border-radius:18px;
padding:25px;
display:inline-block;
background:#FAFAFA;'>

<div style='font-size:17px;
font-weight:600;
margin-bottom:8px;
color:#111827;'>

📱 Telefonunuzla tarayın

</div>

<div style='font-size:14px;
color:#6B7280;
margin-bottom:18px;'>

QR kodu kameranızla okutmanız yeterli.

</div>

<img src='cid:{qrImage.ContentId}'
width='170'
style='display:block;border-radius:8px;'>

</div>

</td>

</tr>

</table>

<table width='100%'
style='margin-top:40px;'>

<tr>

<td
style='background:#F8FAFC;
border-radius:12px;
padding:18px;
font-size:13px;
color:#6B7280;
text-align:center;'>

🛡️ Bu e-postayı beklemiyor muydunuz?

<br>

Bu mesajı güvenle yok sayabilirsiniz.

</td>

</tr>

</table>

</td>

</tr>

</table>

<p style='margin-top:30px;
text-align:center;
font-size:13px;
color:#9CA3AF;'>

❤️ ReviewLinkHub © {DateTime.UtcNow.Year}

</p>

</td>
</tr>
</table>

</body>
</html>";

        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(_options.SmtpHost, _options.SmtpPort, SecureSocketOptions.StartTls, cancellationToken);
        await client.AuthenticateAsync(_options.SmtpUser, _options.SmtpPassword, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}