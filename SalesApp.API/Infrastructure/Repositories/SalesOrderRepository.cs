using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesApp.API.Application.Interfaces;
using SalesApp.API.Domain.Entities;
using SalesApp.API.Infrastructure.Data;

namespace SalesApp.API.Infrastructure.Repositories;

public class SalesOrderRepository : ISalesOrderRepository
{
    private readonly AppDbContext _ctx;
    public SalesOrderRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<List<SalesOrder>> GetAllAsync()
    {
        return await _ctx.SalesOrders
            .Include(x => x.Client)
            .ToListAsync();
    }

    public async Task<SalesOrder?> GetByIdAsync(int id)
    {
        return await _ctx.SalesOrders
            .Include(o => o.Client)
            .Include(o => o.Items)
            .ThenInclude(i => i.Item)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<SalesOrder> AddAsync(SalesOrder order)
    {
        _ctx.SalesOrders.Add(order);
        await _ctx.SaveChangesAsync();
        return order;
    }

    public async Task UpdateAsync(SalesOrder order)
    {
        _ctx.SalesOrders.Update(order);
        await _ctx.SaveChangesAsync();
    }
}
