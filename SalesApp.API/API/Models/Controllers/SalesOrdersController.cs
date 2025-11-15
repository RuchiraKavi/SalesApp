using Microsoft.AspNetCore.Mvc;
using SalesApp.API.Application.Services;
using SalesApp.API.Domain.Entities;
using SalesApp.API.API.Models;
using SalesApp.API.Application.Interfaces;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.API.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly SalesOrderService _service;
    private readonly ISalesOrderRepository _repo;

    public SalesOrdersController(SalesOrderService service, ISalesOrderRepository repo)
    {
        _service = service;
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var order = await _repo.GetByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create(SalesOrderDto dto)
    {
        var order = new SalesOrder
        {
            ClientId = dto.ClientId,
            InvoiceNo = dto.InvoiceNo,
            InvoiceDate = dto.InvoiceDate,
            ReferenceNo = dto.ReferenceNo,
            Note = dto.Note,
            Items = dto.Items.Select(x => new SalesOrderItem
            {
                ItemId = x.ItemId,
                Note = x.Note,
                Quantity = x.Quantity,
                TaxRate = x.TaxRate
            }).ToList()
        };

        var created = await _service.CreateAsync(order);
        return Ok(created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, SalesOrderDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return NotFound();

        existing.ClientId = dto.ClientId;
        existing.InvoiceNo = dto.InvoiceNo;
        existing.InvoiceDate = dto.InvoiceDate;
        existing.ReferenceNo = dto.ReferenceNo;
        existing.Note = dto.Note;

        // replace items (simpler approach)
        existing.Items = dto.Items.Select(x => new SalesOrderItem
        {
            ItemId = x.ItemId,
            Note = x.Note,
            Quantity = x.Quantity,
            TaxRate = x.TaxRate
        }).ToList();

        await _service.UpdateAsync(existing);
        return Ok(existing);
    }
}
