namespace SalesApp.API.Domain.Entities;

public class SalesOrder
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public Client? Client { get; set; }

    public string? InvoiceNo { get; set; }
    public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }

    public List<SalesOrderItem> Items { get; set; } = new();

    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }
}
