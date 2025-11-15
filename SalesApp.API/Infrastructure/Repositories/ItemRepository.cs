using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesApp.API.Application.Interfaces;
using SalesApp.API.Domain.Entities;
using SalesApp.API.Infrastructure.Data;

namespace SalesApp.API.Infrastructure.Repositories;

public class ItemRepository : IItemRepository
{
    private readonly AppDbContext _ctx;
    public ItemRepository(AppDbContext ctx) => _ctx = ctx;

    public Task<List<Item>> GetAllAsync() => _ctx.Items.ToListAsync();
    public Task<Item?> GetByIdAsync(int id) => _ctx.Items.FirstOrDefaultAsync(i => i.Id == id);
}
