import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// 1. Lấy tất cả chấm công
export const getAllAttendance: any = createAsyncThunk(
  "attendance/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/attendance/all");
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Check-in
export const checkIn: any = createAsyncThunk(
  "attendance/checkIn",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/attendance/checkin", data);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Check-out
export const checkOut: any = createAsyncThunk(
  "attendance/checkOut",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/attendance/checkout", data);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Xóa chấm công
export const deleteAttendance: any = createAsyncThunk(
  "attendance/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/attendance/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Lấy chấm công hiện tại
export const getCurrentAttendance: any = createAsyncThunk(
  "attendance/getCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/attendance/get-current");
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    attendanceAll: [],
    attendanceByUser: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Lấy tất cả chấm công

      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceAll = action.payload || [];
      })
      // Check-in
      .addCase(checkIn.fulfilled, (state: any, action) => {
        state.loading = false;
        state.attendanceAll.unshift(action.payload);
        // thêm vào danh sách chấm công của user có id = action.payload.userId
        // const existAttendance = state.attendanceByUser.find(
        //   (item: any) => item.employee.id === action.payload.employee.id &&
        //     item.date === action.payload.date
        // );
        // if (existAttendance) {
          state.attendanceByUser.unshift(action.payload);
        // }
      })
      // Check-out
      .addCase(checkOut.fulfilled, (state: any, action) => {
        state.loading = false;
        state.attendanceAll = state.attendanceAll.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
        state.attendanceByUser = state.attendanceByUser.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      // Xóa chấm công
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceAll = state.attendanceAll.filter(
          (item: any) => item.id !== action.payload
        );
      })
      // Lấy chấm công hiện tại
      .addCase(getCurrentAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceByUser = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
