import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// 1. Tạo position
export const createPosition = createAsyncThunk(
  "position/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/positions/create", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Tìm kiếm position
export const searchPositions: any= createAsyncThunk(
  "position/search",
  async (criteria, { rejectWithValue }) => {
    try {
      const res = await api.post("/positions/search", criteria);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Lấy position theo ID
export const getPositionById = createAsyncThunk(
  "position/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/positions/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Cập nhật position
export const updatePosition = createAsyncThunk(
  "position/update",
  async (
    { id, updatedData }: { id: any; updatedData: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/positions/update/${id}`, updatedData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Xóa position
export const deletePosition = createAsyncThunk(
  "position/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/positions/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// 6. Lấy tất cả position
export const getAllPositions: any = createAsyncThunk(
  "position/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/positions/all");
      console.log(res.data?.result);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const positionSlice = createSlice({
  name: "position",
  initialState: {
    positions: [],
    positionAll: [],
    pagination: {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
    current: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Tạo
      .addCase(createPosition.fulfilled, (state: any, action) => {
        state.loading = false;
        state.positions.unshift(action.payload); // thêm vào đầu danh sách
      })
      // Tìm kiếm
      .addCase(searchPositions.fulfilled, (state, action) => {
        state.loading = false;
        state.positions = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          size: 10,
          totalElements: 0,
          totalPages: 0,
        };
      })
      // Lấy theo ID
      .addCase(getPositionById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      // Cập nhật
      .addCase(updatePosition.fulfilled, (state: any, action) => {
        state.loading = false;
        state.positions = state.positions.map((pos: any) =>
          pos.id === action.payload.id ? action.payload : pos
        );
      })
      // Xóa
      .addCase(deletePosition.fulfilled, (state, action) => {
        state.loading = false;
        state.positions = state.positions.filter(
          (pos: any) => pos.id !== action.payload
        );
      })
      // Lấy tất cả
      .addCase(getAllPositions.fulfilled, (state, action) => {
        state.loading = false;
        state.positionAll = action.payload || [];
      })
  },
});

export default positionSlice.reducer;
