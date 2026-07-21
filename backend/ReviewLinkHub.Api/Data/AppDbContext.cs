using Microsoft.EntityFrameworkCore;
using ReviewLinkHub.Api.Models;
namespace ReviewLinkHub.Api.Data;



public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {


    }
    public DbSet<ReviewRequest> ReviewRequests { get; set; }
    public  DbSet<Business> Businesses { get; set; }
    
    public DbSet<EmailDelivery> EmailDeliveries { get; set; }

}
