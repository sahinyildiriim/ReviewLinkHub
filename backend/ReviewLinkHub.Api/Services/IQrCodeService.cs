namespace ReviewLinkHub.Api.Services;

public interface IQrCodeService
{
    byte[] GeneratePng(string content);
}