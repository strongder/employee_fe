import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import LeaveRequests from "@/pages/admin/leave-requests";

// 1. Tạo đơn xin nghỉ
export const createLeaveRequest: any = createAsyncThunk(
  "leaveRequest/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/leave-requests/create", data);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Tìm kiếm đơn xin nghỉ
export const searchLeaveRequests = createAsyncThunk(
  "leaveRequest/search",
  async (criteria, { rejectWithValue }) => {
    try {
      const res = await api.post("/leave-requests/search", criteria);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Lấy đơn theo ID
export const getLeaveRequestById = createAsyncThunk(
  "leaveRequest/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/leave-requests/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Cập nhật đơn xin nghỉ
export const updateLeaveRequest: any = createAsyncThunk(
  "leaveRequest/update",
  async (
    { id, updatedData }: { id: any; updatedData: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/leave-requests/update/${id}`, updatedData);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Xóa đơn xin nghỉ
export const deleteLeaveRequest = createAsyncThunk(
  "leaveRequest/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/leave-requests/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 6. Lấy tất cả đơn xin nghỉ
export const getAllLeaveRequest: any = createAsyncThunk(
  "leaveRequest/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/leave-requests/all`);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const changeStatus: any = createAsyncThunk(
  "leaveRequest/changeStatus",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.put(`/leave-requests/change-status`, data);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. getByEmployee
export const getByEmployee: any = createAsyncThunk(
  "contract/getByEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/leave-requests/${id}/employee`);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const leaveRequestSlice = createSlice({
  name: "leaveRequest",
  initialState: {
    leaveRequestAll: [],
    leaveRequests: [],
    pagination: {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
    current: {},
    leaveRequestsByEmployee: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Tạo
      .addCase(createLeaveRequest.fulfilled, (state: any, action) => {
        state.loading = false;
        state.leaveRequestAll.unshift(action.payload);
        state.leaveRequestsByEmployee.unshift(action.payload);
      })
      // Tìm kiếm
      .addCase(searchLeaveRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload?.data || [];
        state.pagination = action.payload?.pagination || {
          page: 1,
          size: 10,
          totalElements: 0,
          totalPages: 0,
        };
      })
      // Lấy theo ID
      .addCase(getLeaveRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      // Cập nhật
      .addCase(updateLeaveRequest.fulfilled, (state: any, action) => {
        state.loading = false;
        state.leaveRequestAll = state.leaveRequestAll.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      // Xóa
      .addCase(deleteLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = state.leaveRequests.filter(
          (item: any) => item.id !== action.payload
        );
      })
      // Lấy tất cả
      .addCase(getAllLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequestAll = action.payload;
      })
      .addCase(changeStatus.fulfilled, (state: any, action) => {
        state.loading = false;
        state.leaveRequestAll = state.leaveRequestAll.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
        state.leaveRequestsByEmployee = state.leaveRequestsByEmployee.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(getByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequestsByEmployee = action.payload || [];
      });
  },
});

export default leaveRequestSlice.reducer;
