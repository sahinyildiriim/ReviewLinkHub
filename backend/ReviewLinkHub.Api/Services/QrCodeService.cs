using QRCoder;

namespace ReviewLinkHub.Api.Services;

public class QrCodeService : IQrCodeService
{
    public byte[] GeneratePng(string content)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        return qrCode.GetGraphic(20);
    }
}