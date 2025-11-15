namespace SalesApp.API.Domain.Entities;

public class Item
{
    public int Id { get; set; }
    public string ItemCode { get; set; } = default!;
    public string Description { get; set; } = default!;
    public decimal Price { get; set; }
}
