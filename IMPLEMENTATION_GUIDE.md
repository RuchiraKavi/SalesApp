# SalesApp - Complete Implementation

## Project Overview

SalesApp is a full-stack Sales Order Management system built with .NET Core 9 ASP.NET Web API backend and React with Redux frontend. The application allows users to create, manage, and view sales orders with automatic calculations for item amounts and taxes.

## Architecture

### Backend (.NET Core 9)

- **API Layer**: RESTful endpoints in Controllers
- **Business Logic**: Services for order calculations
- **Data Access**: Repository pattern with Entity Framework Core
- **Database**: SQL Server (LocalDB)

**Folder Structure:**

```
SalesApp.API/
├── API/
│   ├── Models/
│   │   ├── SalesOrderDto.cs
│   │   └── Controllers/
│   │       ├── ClientsController.cs
│   │       ├── ItemsController.cs
│   │       └── SalesOrdersController.cs
├── Application/
│   ├── Interfaces/
│   │   ├── IClientRepository.cs
│   │   ├── IItemRepository.cs
│   │   └── ISalesOrderRepository.cs
│   └── Services/
│       └── SalesOrderService.cs
├── Domain/
│   └── Entities/
│       ├── Client.cs
│       ├── Item.cs
│       ├── SalesOrder.cs
│       └── SalesOrderItem.cs
└── Infrastructure/
    ├── Data/
    │   ├── AppDbContext.cs
    │   └── DbSeeder.cs
    └── Repositories/
        ├── ClientRepository.cs
        ├── ItemRepository.cs
        └── SalesOrderRepository.cs
```

### Frontend (React + Redux)

- **UI Framework**: React with Functional Components
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Navigation**: React Router
- **HTTP Client**: Axios

**Folder Structure:**

```
salesapp-frontend/
├── src/
│   ├── components/       (Reusable UI components)
│   ├── pages/
│   │   ├── Home.jsx      (Screen 2: Orders List)
│   │   └── SalesOrder.jsx (Screen 1: Order Form)
│   ├── redux/
│   │   ├── slices/
│   │   │   ├── clientSlice.js
│   │   │   └── orderSlice.js
│   │   └── store.js
│   ├── services/
│   │   └── api.js        (Axios configuration)
│   ├── App.jsx           (Router setup)
│   └── main.jsx
├── .env                  (Environment variables)
└── tailwind.config.js    (Tailwind configuration)
```

## Features Implemented

### Screen 1: Sales Order Form

✅ Customer name dropdown (populated from Clients table)
✅ Automatic address fill based on selected customer
✅ Item code dropdown (populated from Items table)
✅ Description dropdown with item descriptions
✅ Quantity and tax rate input fields
✅ Automatic calculations:

- Excl Amount = Quantity × Price
- Tax Amount = Excl Amount × Tax Rate / 100
- Incl Amount = Excl Amount + Tax Amount
  ✅ Add/Remove line items dynamically
  ✅ Order totals displayed (Subtotal, Tax, Total Inc)
  ✅ Save new orders and edit existing orders
  ✅ Responsive design with Tailwind CSS

### Screen 2: Sales Orders Home

✅ Displays list of all sales orders in a table
✅ Shows Invoice No, Customer, Date, Reference, Total Amount
✅ "Add New Order" button to create new orders
✅ Edit button on each row
✅ Double-click row to edit order
✅ Loading state indicator
✅ Empty state message
✅ Responsive table layout
✅ Automatic pagination display

## API Endpoints

### Clients

- `GET /api/clients` - List all clients
- `GET /api/clients/{id}` - Get client by ID

### Items

- `GET /api/items` - List all items
- `GET /api/items/{id}` - Get item by ID

### Sales Orders

- `GET /api/salesorders` - List all sales orders
- `GET /api/salesorders/{id}` - Get order by ID
- `POST /api/salesorders` - Create new order
- `PUT /api/salesorders/{id}` - Update existing order

## Database Schema

### Clients Table

- Id (int, PK)
- CustomerName (string)
- Address1, Address2 (string)
- Suburb, PostCode (string)

### Items Table

- Id (int, PK)
- ItemCode (string)
- Description (string)
- Price (decimal 18,2)

### SalesOrders Table

- Id (int, PK)
- ClientId (int, FK)
- InvoiceNo (string)
- InvoiceDate (datetime)
- ReferenceNo (string)
- Note (string)
- TotalExcl, TotalTax, TotalIncl (decimal 18,2)

### SalesOrderItems Table

- Id (int, PK)
- SalesOrderId (int, FK)
- ItemId (int, FK)
- Quantity (decimal)
- TaxRate (decimal 5,2)
- ExclAmount, TaxAmount, InclAmount (decimal 18,2)
- Note (string)

## Technologies Used

### Backend

- .NET Core 9
- ASP.NET Core Web API
- Entity Framework Core 8.0.10
- SQL Server
- AutoMapper 12.0.1
- Swashbuckle/Swagger 6.8.0

### Frontend

- React 19.2.0
- Redux Toolkit 2.10.1
- React Router DOM 7.9.6
- Axios 1.13.2
- Tailwind CSS 4.1.17
- Vite 7.2.2

## Running the Application

### Backend

```powershell
cd "SalesApp.API"
dotnet build
dotnet run
```

API will be available at: `http://localhost:5196`
Swagger documentation: `http://localhost:5196/swagger`

### Frontend

```powershell
cd "salesapp-frontend"
npm install (if needed)
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Configuration

### Environment Variables (Frontend)

- `VITE_API_URL`: Backend API base URL (default: http://localhost:5196/api)

### API Integration

- CORS enabled for localhost:5173 on backend
- Vite proxy configured for `/api` routes
- Axios interceptors ready for future auth/error handling

## Deployment Notes

### State Management

- Redux Toolkit manages:
  - Orders list and current order
  - Clients and items for dropdowns
  - Loading states and error handling

### Calculations

- Line-item calculations performed on frontend (user feedback)
- Final calculations verified on backend before saving
- Decimal precision enforced (18,2 for amounts, 5,2 for tax rates)

### Error Handling

- Try-catch blocks on API calls
- User-friendly alert messages
- Console logging for debugging
- Redux error state tracking

## Future Enhancements

- Print functionality for sales orders
- PDF export capabilities
- Pagination for orders list
- Search and filter functionality
- Validation rules enforcement
- Audit trail for orders
- User authentication and authorization
- Order status workflow

## Notes

- The database is automatically seeded with sample Clients and Items on first run
- All dates use ISO format (YYYY-MM-DD)
- Currency formatting uses fixed 2 decimal places
- Responsive design works on desktop and tablet devices
