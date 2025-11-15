import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchClients, fetchItems } from "../redux/slices/clientSlice";
import { fetchOrderById, createOrder, updateOrder, clearCurrent } from "../redux/slices/orderSlice";

export default function SalesOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialized = useRef(false);

  const { clients, items } = useSelector((state) => state.clients);
  const { current } = useSelector((state) => state.orders);

  const [order, setOrder] = useState({
    clientId: "",
    invoiceNo: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    referenceNo: "",
    note: "",
    items: [],
  });

  const location = useLocation();

  useEffect(() => {
    // If navigation passed an order via state, use it to prefill immediately.
    // Otherwise clear current and fetch from API when id is present.
    dispatch(fetchClients());
    dispatch(fetchItems());

    if (id) {
      const navOrder = location?.state?.order;
      if (navOrder && Number(navOrder.id) === Number(id)) {
        // map navOrder to local state shape
        const mappedItems = (navOrder.items || []).map((i) => ({
          itemId: i.itemId,
          quantity: i.quantity,
          taxRate: i.taxRate,
          exclAmount: i.exclAmount || 0,
          taxAmount: i.taxAmount || 0,
          inclAmount: i.inclAmount || 0,
          note: i.note,
        }));

        setOrder({
          clientId: navOrder.clientId,
          invoiceNo: navOrder.invoiceNo,
          invoiceDate: navOrder.invoiceDate?.slice(0, 10),
          referenceNo: navOrder.referenceNo,
          note: navOrder.note,
          items: mappedItems,
        });

        initialized.current = true;
        // also update current in store by dispatching fetchOrderById in background if you want freshest data
      } else {
        initialized.current = false;
        dispatch(clearCurrent());
        dispatch(fetchOrderById(id));
      }
    } else {
      dispatch(clearCurrent());
    }
  }, [dispatch, id, location]);

  useEffect(() => {
    if (id && current && !initialized.current) {
      initialized.current = true;

      const mappedItems = (current.items || []).map((i) => ({
        itemId: i.itemId,
        quantity: i.quantity,
        taxRate: i.taxRate,
        exclAmount: i.exclAmount,
        taxAmount: i.taxAmount,
        inclAmount: i.inclAmount,
        note: i.note,
      }));

      setOrder({
        clientId: current.clientId,
        invoiceNo: current.invoiceNo,
        invoiceDate: current.invoiceDate?.slice(0, 10),
        referenceNo: current.referenceNo,
        note: current.note,
        items: mappedItems,
      });
    }
  }, [current, id]);

  const addLine = () => {
    setOrder((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { itemId: "", quantity: 1, taxRate: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0, note: "" },
      ],
    }));
  };

  const removeLine = (index) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleLineChange = (index, field, value) => {
    setOrder((prev) => {
      const copy = { ...prev };
      copy.items = copy.items.map((it, idx) =>
        idx === index ? { ...it, [field]: value } : it
      );
      return copy;
    });
  };

  // Compute line amounts (excl/tax/incl) on render using current `items` prices.
  const computeLineAmounts = (line) => {
    const item = items.find((x) => x.id === Number(line.itemId));
    const price = item ? item.price : 0;
    const quantity = Number(line.quantity) || 0;
    const taxRate = Number(line.taxRate) || 0;

    const exclAmount = quantity * price;
    const taxAmount = (exclAmount * taxRate) / 100;
    const inclAmount = exclAmount + taxAmount;

    return { price, exclAmount, taxAmount, inclAmount };
  };

  const save = async () => {
    const payload = {
      clientId: Number(order.clientId),
      invoiceNo: order.invoiceNo,
      invoiceDate: order.invoiceDate,
      referenceNo: order.referenceNo,
      note: order.note,
      items: order.items.map((i) => ({
        itemId: Number(i.itemId),
        note: i.note,
        quantity: Number(i.quantity),
        taxRate: Number(i.taxRate),
      })),
    };

    try {
      if (id) await dispatch(updateOrder({ id, payload }));
      else await dispatch(createOrder(payload));

      alert("Order Saved Successfully");
      navigate("/");
    } catch (error) {
      alert("Error saving order: " + error.message);
    }
  };

  const clientSelected = clients.find((c) => c.id === Number(order.clientId));

  const totals = order.items.reduce((acc, it) => {
    const { exclAmount, taxAmount, inclAmount } = computeLineAmounts(it);
    acc.excl += Number(exclAmount || 0);
    acc.tax += Number(taxAmount || 0);
    acc.incl += Number(inclAmount || 0);
    return acc;
  }, { excl: 0, tax: 0, incl: 0 });
  const totalExcl = totals.excl;
  const totalTax = totals.tax;
  const totalIncl = totals.incl;

  return (
  <div className="min-h-screen bg-gray-100 p-4">

    {/* TOP HEADER */}
    <div className="rounded-md mb-4 border border-gray-300 overflow-hidden">
  {/* Upper Section: Title */}
  <div className="bg-gray-300 p-4">
    <h1 className="text-xl font-bold text-center">Sales Order</h1>
  </div>

  {/* Horizontal Line */}
  <hr className="border-t border-gray-300" />

  {/* Lower Section: Button */}
  <div className="p-4 flex justify-left">
    <button
      onClick={save}
      className="px-4 py-2 bg-gray-200 border border-gray-300 hover:bg-gray-300 text-black rounded flex items-center gap-2"
    >
      ✔ Save Order
    </button>
  </div>
</div>



    {/* CUSTOMER + INVOICE SECTION */}
    <div className="bg-white border rounded-md p-4 mb-4 grid grid-cols-2 gap-6">

      {/* LEFT : CUSTOMER */}
      <div>
        {/* Customer Name */}
        <div className="mb-2 grid grid-cols-[10rem_20rem] items-center gap-4">
          <label className="font-semibold">Customer Name</label>
          <select
            value={order.clientId}
            onChange={(e) => setOrder({ ...order, clientId: e.target.value })}
            className="border rounded px-2 py-1"
          >
            <option value="">-- Select --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.customerName}
              </option>
            ))}
          </select>
        </div>

        {/* Address fields */}
        <div className="space-y-1">
          {[
            { label: "Address 1", value: clientSelected?.address1 },
            { label: "Address 2", value: clientSelected?.address2 },
            { label: "Address 3", value: clientSelected?.address3 },
            { label: "Suburb", value: clientSelected?.suburb },
            { label: "State", value: clientSelected?.state },
            { label: "Post Code", value: clientSelected?.postCode },
          ].map((field, i) => (
            <div key={i} className="grid grid-cols-[10rem_20rem] items-center gap-4">
              <label>{field.label}</label>
              <input
                className="border rounded px-2 py-1"
                readOnly
                value={field.value || ""}
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT : INVOICE DETAILS */}
      <div>
        {[
          { label: "Invoice No.", key: "invoiceNo", type: "text" },
          { label: "Invoice Date", key: "invoiceDate", type: "date" },
          { label: "Reference No", key: "referenceNo", type: "text" },
        ].map((f) => (
          <div key={f.key} className="grid grid-cols-[8rem_20rem] items-center gap-4 mb-3">
            <label>{f.label}</label>
            <input
              type={f.type}
              value={order[f.key]}
              onChange={(e) => setOrder({ ...order, [f.key]: e.target.value })}
              className="border rounded px-2 py-1"
            />
          </div>
        ))}

        {/* Note */}
        <div className="grid grid-cols-[8rem_20rem] gap-4">
          <label>Note</label>
          <textarea
            className="border rounded px-2 py-1 h-28"
            value={order.note}
            onChange={(e) => setOrder({ ...order, note: e.target.value })}
          />
        </div>
      </div>

    </div>

    {/* ITEM TABLE */}
    <div className="bg-white border rounded-md mb-4">
      <table className="w-full border-collapse [&_td]:py-3 [&_td]:px-3 [&_th]:py-3 [&_th]:px-3">
        <thead className="bg-gray-100 border-b">
          <tr>
            {[
              "Item Code",
              "Description",
              "Note",
              "Quantity",
              "Price",
              "Tax",
              "Excl Amount",
              "Tax Amount",
              "Incl Amount",
              "",
            ].map((h, i) => (
              <th key={i} className="border text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {order.items.map((line, idx) => {
            const item = items.find((i) => i.id === Number(line.itemId));

            return (
              <tr key={idx} className="border-b">
                <td className="border">
                  <select
                    value={line.itemId}
                    onChange={(e) => handleLineChange(idx, "itemId", e.target.value)}
                    className="w-full border rounded px-1 py-1"
                  >
                    <option value="">-- Select --</option>
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.itemCode}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="border">{item?.description ?? ""}</td>

                <td className="border">
                  <input
                    value={line.note}
                    onChange={(e) => handleLineChange(idx, "note", e.target.value)}
                    className="border rounded px-1 py-1 w-full"
                  />
                </td>

                <td className="border">
                  <input
                    type="number"
                    value={line.quantity}
                    onChange={(e) => handleLineChange(idx, "quantity", e.target.value)}
                    className="border rounded px-1 py-1 w-20 text-center"
                  />
                </td>

                <td className="border text-right">
                  {(computeLineAmounts(line).price ?? 0).toFixed(2)}
                </td>

                <td className="border">
                  <input
                    type="number"
                    value={line.taxRate}
                    onChange={(e) => handleLineChange(idx, "taxRate", e.target.value)}
                    className="border rounded px-1 py-1 w-16 text-center"
                  />
                </td>

                <td className="border text-right">{(computeLineAmounts(line).exclAmount || 0).toFixed(2)}</td>
                <td className="border text-right">{(computeLineAmounts(line).taxAmount || 0).toFixed(2)}</td>
                <td className="border text-right">{(computeLineAmounts(line).inclAmount || 0).toFixed(2)}</td>

                <td className="border text-center">
                  <button className="text-red-600" onClick={() => removeLine(idx)}>
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="p-3 border-t bg-gray-50">
        <button
          onClick={addLine}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          + Add Item
        </button>
      </div>
    </div>

    {/* TOTALS */}
    <div className="bg-white border rounded-md p-4 w-64 ml-auto">
      <div className="flex justify-between mb-2">
        <label>Total Excl</label>
        <input className="border w-24 text-right px-2 py-1" readOnly value={totalExcl.toFixed(2)} />
      </div>
      <div className="flex justify-between mb-2">
        <label>Total Tax</label>
        <input className="border w-24 text-right px-2 py-1" readOnly value={totalTax.toFixed(2)} />
      </div>
      <div className="flex justify-between">
        <label>Total Incl</label>
        <input className="border w-24 text-right px-2 py-1" readOnly value={totalIncl.toFixed(2)} />
      </div>
    </div>

    {/* BOTTOM BUTTONS */}
    <div className="flex justify-center gap-6 mt-6">
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-gray-500 text-white rounded"
      >
        Cancel
      </button>
    </div>
  </div>
);

}
