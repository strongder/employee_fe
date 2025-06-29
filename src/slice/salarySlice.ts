import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// 1. Tạo thưởng
export const createSalary: any = createAsyncThunk(
  "salary/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/salaries/create", data);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Tìm kiếm thưởng
export const searchSalary = createAsyncThunk(
  "salary/search",
  async (criteria, { rejectWithValue }) => {
    try {
      const res = await api.post("/salaries/search", criteria);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Lấy lương theo ID
export const getSalaryById = createAsyncThunk(
  "salary/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/salaries/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Cập nhật luơng
export const updateSalary: any = createAsyncThunk(
  "salary/update",
  async (
    { id, updatedData }: { id: any; updatedData: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/salaries/update/${id}`, updatedData);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Lấy lương theo nhân viên
export const getByEmployee: any = createAsyncThunk(
  "bonus/getByEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/salaries/${id}/employee`);
      console.log("-------", res.data.result);

      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Xóa thưởng
export const deleteSalary: any = createAsyncThunk(
  "salary/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/salaries/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Lấy tất cả
export const getAllSalary: any = createAsyncThunk(
  "salary/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/salaries/all`);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const calculateSalary:any = createAsyncThunk(
  "salary/calculateSalary",
  async ({ param }: any, { rejectWithValue }) => {
    try {
      const res = await api.get(`/salaries/calculate`, {
        params: param,
      });

      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const salarySlice = createSlice({
  name: "salary",
  initialState: {
    salaryAll: [],
    salarys: [],
    pagination: {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
    current: {},
    salaryByEmployee: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createSalary.fulfilled, (state: any, action) => {
        state.loading = false;
        state.salaryAll.unshift(action.payload);
      })

      // Tìm kiếm
      .addCase(searchSalary.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.salarys = action.payload?.data || [];
        state.pagination = action.payload?.pagination || {
          page: 1,
          size: 10,
          totalElements: 0,
          totalPages: 0,
        };
      })
      // Lấy theo ID
      .addCase(getSalaryById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      // Cập nhật
      .addCase(updateSalary.fulfilled, (state: any, action) => {
        state.loading = false;
        state.salaryAll = state.salaryAll.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      // Xóa
      .addCase(deleteSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.salaryAll = state.salaryAll.filter(
          (item: any) => item.id !== action.payload
        );
      })
      .addCase(getAllSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.salaryAll = action.payload;
      })
      .addCase(getByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.salaryByEmployee = action.payload;
      });
  },
});

export default salarySlice.reducer;
