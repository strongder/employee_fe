import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";

// 1. Tạo employee mới
export const createEmployee: any = createAsyncThunk(
  "employee/create",
  async (
    employeeData: any,
    { rejectWithValue }: { rejectWithValue: (message: string) => void }
  ) => {
    try {
      const res = await api.post("/employees/create", employeeData);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Tìm kiếm employee
export const searchEmployees: any = createAsyncThunk(
  "employee/search",
  async (
    searchCriteria: any,
    { rejectWithValue }: { rejectWithValue: (message: string) => void }
  ) => {
    try {
      const res = await api.post("/employees/search", searchCriteria);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Cập nhật employee
export const updateEmployee: any = createAsyncThunk(
  "employee/update",
  async (
    { employeeId, updatedData }: { employeeId: number; updatedData: any },
    { rejectWithValue }: { rejectWithValue: (message: string) => void }
  ) => {
    try {
      const res = await api.put(`/employees/update/${employeeId}`, updatedData);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Lấy thông tin employee hiện tại
export const getCurrentEmployee = createAsyncThunk(
  "employee/getCurrent",
  async (
    _,
    { rejectWithValue }: { rejectWithValue: (message: string) => void }
  ) => {
    try {
      const res = await api.get("/employees/current");
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Xóa employee
export const deleteEmployee:any = createAsyncThunk(
  "employee/delete",
  async (
    employeeId: number,
    { rejectWithValue }: { rejectWithValue: (message: string) => void }
  ) => {
    try {
      await api.delete(`/employees/delete/${employeeId}`);
      return employeeId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Lấy thông tin employee hiện tại
export const findEmployeeById: any = createAsyncThunk(
  "employee/getById",
  async (
    id: number,
    { rejectWithValue }: { rejectWithValue: (message: string) => void }
  ) => {
    try {
      const res = await api.get("/employees/" + id);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Lấy tất cả employee
export const getAllEmployee: any = createAsyncThunk(
  "employee/getAll",
  async (
    _,
    { rejectWithValue }: { rejectWithValue: (message: string) => void }
  ) => {
    try {
      const res = await api.get("/employees/all");
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const changeAvatar: any = createAsyncThunk(
  "employee/chngeAvatar",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.put("/employees/change-avatar", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
interface EmployeeState {
  employeeAll: any[];
  employees: any[];
  pagination: any;
  current: any;
  loading: boolean;
  error: string | null;
}

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employeeAll: [],
    employees: [],
    employeeById: [],
    pagination: {},
    current: null,
    loading: false,
    error: null,
  } as EmployeeState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Tạo employee
      .addCase(createEmployee.fulfilled, (state, action: any) => {
        state.loading = false;
        state.employeeAll.push(action.payload);
      })

      // Tìm kiếm employee
      .addCase(searchEmployees.fulfilled, (state, action: any) => {
        state.loading = false;
        state.employees = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      // Cập nhật employee
      .addCase(updateEmployee.fulfilled, (state, action: any) => {
        state.loading = false;
        state.employeeAll = state.employeeAll.map((emp) =>
          emp.id === action.payload.id ? action.payload : emp
        );
      })

      // Lấy current employee
      .addCase(getCurrentEmployee.fulfilled, (state, action: any) => {
        state.loading = false;
        state.current = action.payload;
      })

      // Xóa employee
      .addCase(deleteEmployee.fulfilled, (state, action: any) => {
        console.log("Xóa thành công");
        state.loading = false;
        state.employeeAll = state.employeeAll.filter(
          (emp) => emp.id !== action.payload
        );
      })
      // Lấy employee theo ID
      .addCase(findEmployeeById.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.employeeById = action.payload;
      })
      // Lấy tất cả employee
      .addCase(getAllEmployee.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.employeeAll = action.payload;
      });
  },
});

export default employeeSlice.reducer;
