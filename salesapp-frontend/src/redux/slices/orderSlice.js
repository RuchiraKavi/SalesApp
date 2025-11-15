import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchOrders = createAsyncThunk("orders/fetch", async () => {
  const res = await api.get("/salesorders");
  return res.data;
});

export const fetchOrderById = createAsyncThunk("orders/fetchById", async (id) => {
  const res = await api.get(`/salesorders/${id}`);
  return res.data;
});

export const createOrder = createAsyncThunk("orders/create", async (payload) => {
  const res = await api.post("/salesorders", payload);
  return res.data;
});

export const updateOrder = createAsyncThunk("orders/update", async ({ id, payload }) => {
  const res = await api.put(`/salesorders/${id}`, payload);
  return res.data;
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { 
    list: [], 
    current: null, 
    loading: false,
    error: null 
  },
  reducers: {
    clearCurrent: (state) => { state.current = null; }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const idx = state.list.findIndex(o => o.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      });
  }
});

export const { clearCurrent } = orderSlice.actions;
export default orderSlice.reducer;
