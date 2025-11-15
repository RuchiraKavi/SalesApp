# SalesApp - Quick Start Guide

## ✅ Application Status

Both the backend API and frontend are now **running successfully**:

- **Backend API**: http://localhost:5196

  - Swagger UI: http://localhost:5196/swagger
  - Ready to serve API requests

- **Frontend**: http://localhost:5173
  - React Vite dev server ready
  - All Redux state management configured
  - Tailwind CSS styling applied

## 🚀 How to Use the Application

### Step 1: Access the Application

Open your browser and navigate to: **http://localhost:5173**

You will land on the **Home Page (Screen 2)** which displays all sales orders.

### Step 2: Create a New Sales Order

1. Click the **"+ Add New Order"** button
2. You will be taken to the **Sales Order Form (Screen 1)**

### Step 3: Fill in the Sales Order (Screen 1)

#### Customer Information

1. **Select Customer**: Click the dropdown to see all customers from the database
   - Available customers were seeded automatically
2. **Address auto-fills**: Once you select a customer, their address information appears below

#### Order Details

3. **Invoice No**: Enter a unique invoice number (e.g., INV-001)
4. **Invoice Date**: Select the date for this order
5. **Reference No**: Enter any reference number (optional)

#### Line Items

6. **Add Items**: Click "**+ Add Item**" button to add product lines
7. For each line item:
   - **Item Code**: Select from dropdown (auto-populated from Items table)
   - **Description**: Shows automatically based on selected item
   - **Price**: Displays the item's unit price (read-only)
   - **Quantity**: Enter how many units
   - **Tax %**: Enter tax percentage (e.g., 10 for 10%)

#### Automatic Calculations

The form automatically calculates:

- **Excl Amount** = Quantity × Price
- **Tax Amount** = Excl Amount × Tax Rate / 100
- **Incl Amount** = Excl Amount + Tax Amount

#### Order Totals

At the bottom, you'll see:

- **Subtotal (Excl)**: Sum of all Excl Amounts
- **Tax Amount**: Sum of all Tax Amounts
- **Total (Incl)**: Final amount including tax

### Step 4: Save the Order

1. Click **"Save Order"** button
2. You'll see a success message
3. You'll be redirected back to the Home page

### Step 5: View Your Orders

1. On the **Home Page (Screen 2)**, you'll see your created order in the table
2. The table shows:
   - Invoice No
   - Customer Name
   - Date
   - Reference No
   - Total Amount

### Step 6: Edit an Existing Order

Two ways to edit:

1. Click the **"Edit"** button on any row
2. Or **double-click** the row

This will open the form with the order data pre-filled, and you can modify it.

### Step 7: Save Changes

After editing, click **"Save Order"** to update.

## 📊 Test Data

The application comes pre-seeded with sample data:

### Sample Customers

- Acme Corp - Sydney
- Tech Solutions - Melbourne
- Global Trade - Brisbane

### Sample Items

- Item codes and descriptions are available
- Each item has a price

Feel free to create multiple orders using different combinations of customers and items!

## 🔧 Technical Features

✅ **Frontend**

- React with Functional Components
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- Tailwind CSS for responsive styling

✅ **Backend**

- .NET Core 9 ASP.NET Web API
- Entity Framework Core with SQL Server
- Repository Pattern for data access
- Automatic calculations with validation
- CORS enabled for frontend communication
- Swagger documentation

✅ **Database**

- SQL Server (LocalDB)
- Pre-populated with sample data
- Automatic migrations applied

## 📝 API Endpoints (for reference)

All endpoints are relative to `http://localhost:5196/api`

```
GET    /clients           - List all customers
GET    /items             - List all items
GET    /salesorders       - List all orders
GET    /salesorders/{id}  - Get specific order
POST   /salesorders       - Create new order
PUT    /salesorders/{id}  - Update order
```

## ⚠️ Important Notes

1. **Calculations**: Line item amounts are calculated on the frontend for instant user feedback, and recalculated/verified on the backend before saving.

2. **Dates**: Use the date picker for consistent date formatting.

3. **Decimal Precision**: All monetary amounts support up to 2 decimal places.

4. **Customer Required**: At least one item and customer must be selected before saving.

5. **Print Feature**: Print functionality can be added to the order detail view in future releases.

## 🐛 Troubleshooting

### Cannot connect to backend

- Verify backend is running: http://localhost:5196
- Check browser console for CORS errors
- Ensure Vite proxy is configured (it is by default)

### Customers/Items not showing in dropdowns

- Verify backend is running
- Check if seed data was applied (check backend console)
- Try refreshing the page (F5)

### Calculations not updating

- Ensure all required fields are filled
- Try clicking outside the input field to trigger recalculation
- Save and reload the order

## 📞 Next Steps

1. **Test creating several orders** with different customers and items
2. **Try editing orders** you've created
3. **Verify calculations** are correct
4. **Check the database** to see orders were saved

The application is fully functional and ready for use! 🎉
