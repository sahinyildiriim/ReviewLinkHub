
using Microsoft.EntityFrameworkCore;
using ReviewLinkHub.Api.Data;
using ReviewLinkHub.Api.Options;
using ReviewLinkHub.Api.Services;
QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.Configure<GooglePlacesOptions>(
    builder.Configuration.GetSection("GooglePlaces"));

builder.Services.AddHttpClient<IGooglePlacesService, GooglePlacesService>();

builder.Services.AddScoped<IReviewLinkService, ReviewLinkService>();

builder.Services.AddScoped<IQrCodeService, QrCodeService>();

builder.Services.Configure<EmailOptions>(
    builder.Configuration.GetSection("Email"));
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IReportService, ReportService>();



var app = builder.Build();   

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();