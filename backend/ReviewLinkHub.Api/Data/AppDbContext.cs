using Microsoft.EntityFrameworkCore;
using ReviewLinkHub.Api.Models;
namespace ReviewLinkHub.Api.Data;


public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {


    }
   public  DbSet<Business> Businesses { get; set; }
}