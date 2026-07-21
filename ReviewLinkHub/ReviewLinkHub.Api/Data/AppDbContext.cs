using Microsoft.EntityFrameworkCore;
namespace ReviewLinkHub.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {


    }
  
}