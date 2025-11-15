using SalesApp.API.Application.Interfaces;
using SalesApp.API.Domain.Entities;

namespace SalesApp.API.Application.Services;

public class SalesOrderService
{
    private readonly ISalesOrderRepository _repo;
    private readonly IItemRepository _itemRepo;

    public SalesOrderService(ISalesOrderRepository repo, IItemRepository itemRepo)
    {
        _repo = repo;
        _itemRepo = itemRepo;
    }

    public async Task<SalesOrder> CreateAsync(SalesOrder order)
    {
        // calculate amounts per line using item prices from DB
        foreach (var line in order.Items)
        {
            var item = await _itemRepo.GetByIdAsync(line.ItemId);
            decimal price = item?.Price ?? 0;
            line.ExclAmount = price * line.Quantity;
            line.TaxAmount = Math.Round(line.ExclAmount * line.TaxRate / 100m, 2);
            line.InclAmount = line.ExclAmount + line.TaxAmount;
        }

        order.TotalExcl = order.Items.Sum(i => i.ExclAmount);
        order.TotalTax = order.Items.Sum(i => i.TaxAmount);
        order.TotalIncl = order.Items.Sum(i => i.InclAmount);

        return await _repo.AddAsync(order);
    }

    public async Task UpdateAsync(SalesOrder order)
    {
        // same calculation logic as create
        foreach (var line in order.Items)
        {
            var item = await _itemRepo.GetByIdAsync(line.ItemId);
            decimal price = item?.Price ?? 0;
            line.ExclAmount = price * line.Quantity;
            line.TaxAmount = Math.Round(line.ExclAmount * line.TaxRate / 100m, 2);
            line.InclAmount = line.ExclAmount + line.TaxAmount;
        }

        order.TotalExcl = order.Items.Sum(i => i.ExclAmount);
        order.TotalTax = order.Items.Sum(i => i.TaxAmount);
        order.TotalIncl = order.Items.Sum(i => i.InclAmount);

        await _repo.UpdateAsync(order);
    }
}
