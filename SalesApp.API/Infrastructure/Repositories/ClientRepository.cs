using Microsoft.EntityFrameworkCore;
using SalesApp.API.Application.Interfaces;
using SalesApp.API.Domain.Entities;
using SalesApp.API.Infrastructure.Data;

namespace SalesApp.API.Infrastructure.Repositories;
public class ClientRepository : IClientRepository
{
    private readonly AppDbContext _ctx;
    public ClientRepository(AppDbContext ctx) => _ctx = ctx;

    public Task<List<Client>> GetAllAsync() => _ctx.Clients.ToListAsync();
    public Task<Client?> GetByIdAsync(int id) => _ctx.Clients.FirstOrDefaultAsync(c => c.Id == id);
}
