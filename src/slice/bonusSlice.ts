import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// 1. Tạo thưởng
export const createBonus: any = createAsyncThunk(
  "bonus/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/bonuses/create", data);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Tìm kiếm thưởng
export const searchBonuses = createAsyncThunk(
  "bonus/search",
  async (criteria, { rejectWithValue }) => {
    try {
      const res = await api.post("/bonuses/search", criteria);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Lấy thưởng theo ID
export const getBonusById: any = createAsyncThunk(
  "bonus/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/bonuses/${id}`);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Cập nhật thưởng
export const updateBonus:any = createAsyncThunk(
  "bonus/update",
  async (
    { id, updatedData }: { id: any; updatedData: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/bonuses/update/${id}`, updatedData);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Xóa thưởng
export const deleteBonus:any = createAsyncThunk(
  "bonus/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/bonuses/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Lấy thưởng theo ID
export const getAllBonus: any= createAsyncThunk(
  "bonus/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/bonuses/all`);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getByEmployee: any = createAsyncThunk(
  "bonus/getByEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/bonuses/${id}/employee`);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



// Slice
const bonusSlice = createSlice({
  name: "bonus",
  initialState: {
    bonuses: [],
    bonusAll: [],
    pagination: {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
    current: {},
    bonusesByEmployee: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBonus.fulfilled, (state: any, action) => {
        state.loading = false;
        state.bonusAll.unshift(action.payload);
      })
      // Tìm kiếm
      .addCase(searchBonuses.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchBonuses.fulfilled, (state, action) => {
        state.loading = false;
        state.bonuses = action.payload?.data || [];
        state.pagination = action.payload?.pagination || {
          page: 1,
          size: 10,
          totalElements: 0,
          totalPages: 0,
        };
      })
      // Lấy theo ID
      .addCase(getBonusById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      // Cập nhật
      .addCase(updateBonus.fulfilled, (state: any, action) => {
        state.loading = false;
        state.bonusAll = state.bonusAll.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      // Xóa
      .addCase(deleteBonus.fulfilled, (state, action) => {
        state.loading = false;
        state.bonusAll = state.bonusAll.filter(
          (item: any) => item.id !== action.payload
        );
      })
      // Lấy tất cả
      .addCase(getAllBonus.fulfilled, (state, action) => {
        state.loading = false;
        state.bonusAll = action.payload || [];
      })
      .addCase(getByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.bonusesByEmployee = action.payload || [];
      });

  },
});

export default bonusSlice.reducer;
