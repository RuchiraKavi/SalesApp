import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";

export default function Home(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleEdit = (order) => {
    // pass the order in navigation state so the SalesOrder page
    // can prefill immediately without waiting for an API roundtrip
    navigate(`/order/${order.id}`, { state: { order } });
  };

  const handleAddNew = () => {
    navigate("/order");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-md mb-6 border border-gray-300 overflow-hidden">
        {/* Upper Section: Title */}
        <div className="bg-gray-100 p-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Home</h1>
        </div>

        {/* Horizontal Line */}
        <hr className="border-t border-gray-300" />

        {/* Lower Section: Button */}
        <div className="p-4 flex justify-left">
          <button
            className="px-6 py-3 bg-gray-200 border border-gray-300 hover:bg-gray-300 text-black rounded font-semibold shadow"
            onClick={handleAddNew}
          >
            + Add New Order
          </button>
        </div>
      </div>


        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            Loading orders...
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            <p>No orders found. Click "Add New Order" to create one.</p>
          </div>
        ) : (
<div className="rounded-md border border-gray-300 overflow-hidden mb-6">
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-300">Invoice No</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-300">Customer</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-300">Date</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-300">Reference</th>
          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border border-gray-300">Total Amount</th>
          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border border-gray-300">Action</th>
        </tr>
      </thead>
      <tbody>
        {list.map((o) => (
          <tr
            key={o.id}
            className="hover:bg-gray-50 transition"
            onDoubleClick={() => handleEdit(o)}
          >
            <td className="px-6 py-4 text-sm font-medium text-gray-900 border border-gray-300">{o.invoiceNo}</td>
            <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">{o.client?.customerName || "-"}</td>
            <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">
              {new Date(o.invoiceDate).toLocaleDateString("en-AU")}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700 border border-gray-300">{o.referenceNo || "-"}</td>
            <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right border border-gray-300">
              Rs. {(o.totalIncl || 0).toFixed(2)}
            </td>
            <td className="px-6 py-4 text-center border border-gray-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(o);
                }}
                className="inline-block px-4 py-2 bg-gray-200 border border-gray-300 hover:bg-gray-300 text-black rounded text-sm font-medium"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>



        )}
      </div>
    </div>
  );
}
