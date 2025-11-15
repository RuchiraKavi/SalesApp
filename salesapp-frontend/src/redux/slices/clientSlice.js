import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchClients = createAsyncThunk("clients/fetch", async () => {
  const res = await api.get("/clients");
  return res.data;
});

export const fetchItems = createAsyncThunk("clients/fetchItems", async () => {
  const res = await api.get("/items");
  return res.data;
});

const clientSlice = createSlice({
  name: "clients",
  initialState: {
    clients: [],
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchClients.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }
});

export default clientSlice.reducer;
