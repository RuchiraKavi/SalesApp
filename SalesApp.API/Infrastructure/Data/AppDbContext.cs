using Microsoft.EntityFrameworkCore;
using SalesApp.API.Domain.Entities;

namespace SalesApp.API.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
    public DbSet<SalesOrderItem> SalesOrderItems => Set<SalesOrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // configure relationships if necessary (EF Core will infer many)
        modelBuilder.Entity<SalesOrder>()
            .HasMany(s => s.Items)
            .WithOne(i => i.SalesOrder!)
            .HasForeignKey(i => i.SalesOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // specify precision for decimal columns to avoid truncation warnings
        modelBuilder.Entity<Item>()
            .Property(i => i.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<SalesOrder>()
            .Property(s => s.TotalExcl)
            .HasPrecision(18, 2);
        modelBuilder.Entity<SalesOrder>()
            .Property(s => s.TotalTax)
            .HasPrecision(18, 2);
        modelBuilder.Entity<SalesOrder>()
            .Property(s => s.TotalIncl)
            .HasPrecision(18, 2);

        modelBuilder.Entity<SalesOrderItem>()
            .Property(si => si.ExclAmount)
            .HasPrecision(18, 2);
        modelBuilder.Entity<SalesOrderItem>()
            .Property(si => si.TaxAmount)
            .HasPrecision(18, 2);
        modelBuilder.Entity<SalesOrderItem>()
            .Property(si => si.InclAmount)
            .HasPrecision(18, 2);
        modelBuilder.Entity<SalesOrderItem>()
            .Property(si => si.TaxRate)
            .HasPrecision(5, 2);
    }
}
