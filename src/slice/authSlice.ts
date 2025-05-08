import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api"; // Import axios instance

// Async action: gọi API login
export const login:any = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Gọi API login
      const res = await api.post("/auth/login", credentials);
      const { token } = res.data;
      // Lưu thông tin vào localStorage
      localStorage.setItem("token", token);
      // Gọi tiếp API lấy thông tin tài khoản hiện tại
      const userRes = await api.get("/accounts/current", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userRes?.data?.result;
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user?.employee?.id);
      return { token, user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Action logout
const logoutAction = (state: any) => {
  state.token = null;
  state.user = null;
  state.role = null;
  localStorage.clear();
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),
    loading: false,
    error: null,
  },
  reducers: {
    logout: logoutAction,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
      })

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;