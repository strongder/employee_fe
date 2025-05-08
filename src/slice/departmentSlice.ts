import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// 1. Tạo phòng ban
export const createDepartment:any = createAsyncThunk(
  "department/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/departments/create", data);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Tìm kiếm phòng ban
export const searchDepartments:any= createAsyncThunk(
  "department/search",
  async (criteria: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/departments/search", criteria);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Lấy phòng ban theo ID
export const getDepartmentById = createAsyncThunk(
  "department/getById",
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await api.get(`/departments/${id}`);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Cập nhật phòng ban
export const updateDepartment = createAsyncThunk(
  "department/update",
  async (
    { id, updatedData }: { id: any; updatedData: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/departments/update/${id}`, updatedData);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Xóa phòng ban
export const deleteDepartment = createAsyncThunk(
  "department/delete",
  async (id: any, { rejectWithValue }) => {
    try {
      await api.delete(`/departments/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 6. Lấy danh sách phòng ban
export const getAllDepartments :any = createAsyncThunk(
  "department/getAll",
  async ( ) => {
    try {
      const res = await api.get("/departments/all");
      return res.data?.result;
    } catch (err: any) {
      return; 
    }
  }
);

// Slice
const departmentSlice = createSlice({
  name: "department",
  initialState: {
    departments: [],
    departmentAll: [],
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
      .addCase(createDepartment.fulfilled, (state: any, action) => {
        state.departments.unshift(action.payload);
      })
      .addCase(searchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          size: 10,
          totalElements: 0,
          totalPages: 0,
        };
      })
      .addCase(getAllDepartments.fulfilled, (state, action) => {
        state.departmentAll = action.payload || [];
      })
      .addCase(getDepartmentById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(updateDepartment.fulfilled, (state: any, action) => {
        state.departments = state.departments.map((dep: any) =>
          dep.id === action.payload.id ? action.payload : dep
        );
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter(
          (dep: any) => dep.id !== action.payload
        );
      });
  },
});

export default departmentSlice.reducer;
