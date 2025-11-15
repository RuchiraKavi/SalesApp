using SalesApp.API.Domain.Entities;

public static class DbSeeder
{
    public static async Task SeedAsync(SalesApp.API.Infrastructure.Data.AppDbContext db)
    {
        // Add clients
        db.Clients.AddRange(
            new Client { CustomerName = "Nimal Perera", Address1 = "12 Galle Road", Suburb = "Colombo", State = "WP", PostCode = "00100" },
            new Client { CustomerName = "Sunil Fernando", Address1 = "45 Main Street", Suburb = "Kandy", State = "CP", PostCode = "20000" },
            new Client { CustomerName = "Chathura Silva", Address1 = "78 Lake View", Suburb = "Galle", State = "GP", PostCode = "80000" },
            new Client { CustomerName = "Anjali Wijesinghe", Address1 = "23 Flower Lane", Suburb = "Jaffna", State = "NP", PostCode = "40000" },
            new Client { CustomerName = "Ruwan Jayawardena", Address1 = "56 Hill Road", Suburb = "Negombo", State = "WP", PostCode = "11500" },
            new Client { CustomerName = "Lakshmi Perera", Address1 = "90 Palm Street", Suburb = "Matara", State = "SP", PostCode = "81000" },
            new Client { CustomerName = "Dinesh Amarasinghe", Address1 = "34 Ocean Drive", Suburb = "Trincomalee", State = "EP", PostCode = "31000" },
            new Client { CustomerName = "Tharushi De Silva", Address1 = "12 Sunrise Avenue", Suburb = "Ratnapura", State = "SP", PostCode = "70000" }
        );

        // Add items
        db.Items.AddRange(
            new Item { ItemCode = "ITM001", Description = "Rice - 5kg", Price = 1200m },
            new Item { ItemCode = "ITM002", Description = "Sugar - 1kg", Price = 250m },
            new Item { ItemCode = "ITM003", Description = "Cooking Oil - 1L", Price = 800m },
            new Item { ItemCode = "ITM004", Description = "Tea Leaves - 250g", Price = 600m },
            new Item { ItemCode = "ITM005", Description = "Flour - 2kg", Price = 400m },
            new Item { ItemCode = "ITM006", Description = "Milk Powder - 1kg", Price = 1100m },
            new Item { ItemCode = "ITM007", Description = "Eggs - 12pcs", Price = 450m },
            new Item { ItemCode = "ITM008", Description = "Salt - 500g", Price = 100m },
            new Item { ItemCode = "ITM009", Description = "Coconut Oil - 500ml", Price = 750m },
            new Item { ItemCode = "ITM010", Description = "Biscuits - Pack", Price = 300m }
        );

        try
        {
            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Log duplicate entries or other errors silently - allows re-running without duplicates
            System.Diagnostics.Debug.WriteLine($"Seeding info: {ex.Message}");
        }
    }
}
