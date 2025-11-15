using System;
using System.Collections.Generic;

namespace SalesApp.API.API.Models;

public class SalesOrderItemDto
{
    public int ItemId { get; set; }
    public string? Note { get; set; }
    public int Quantity { get; set; }
    public decimal TaxRate { get; set; }
}

public class SalesOrderDto
{
    public int ClientId { get; set; }
    public string? InvoiceNo { get; set; }
    public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }
    public List<SalesOrderItemDto> Items { get; set; } = new();
}
