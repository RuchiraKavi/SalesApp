using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using SalesApp.API.Application.Interfaces;

namespace SalesApp.API.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemRepository _repo;
    public ItemsController(IItemRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await _repo.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id) => Ok(await _repo.GetByIdAsync(id));
}
