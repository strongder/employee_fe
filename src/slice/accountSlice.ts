import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// 1. Tạo tài khoản
export const createAccount: any = createAsyncThunk(
  "account/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/accounts/create", data);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2. Tìm kiếm tài khoản (với phân trang)
export const searchAccounts: any = createAsyncThunk(
  "account/search",
  async (criteria, { rejectWithValue }) => {
    try {
      const res = await api.post("/accounts/search", criteria);

      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Lấy tài khoản hiện tại
export const getCurrentAccount: any = createAsyncThunk(
  "account/current",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/accounts/current");
      console.log(res.data.result);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4. Cập nhật tài khoản
export const updateAccount = createAsyncThunk(
  "account/update",
  async (
    { id, updatedData }: { id: any; updatedData: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/accounts/update/${id}`, updatedData);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5. Thay đổi trạng thái hoạt động của tài khoản
export const changeAccountStatus = createAsyncThunk(
  "account/changeStatus",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/accounts/change-active/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 6. Xóa tài khoản
export const deleteAccount = createAsyncThunk(
  "account/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/accounts/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

7; // Lấy tất cả tài khoản
export const getAllAccounts: any = createAsyncThunk(
  "account/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/accounts/all");
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// lock account 
export const lockAccount: any = createAsyncThunk(
  "account/lock",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/accounts/lock/${id}`);
      return res.data.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// unlock account
export const unlockAccount: any= createAsyncThunk(
  "account/unlock",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/accounts/unlock/${id}`);
      return res.data.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//7. đổi mật khẩu tài khoản
export const changePassword: any = createAsyncThunk(
  "account/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put("/accounts/change-password", data);
      return res.data.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const accountSlice = createSlice({
  name: "account",
  initialState: {
    accountAll: [],
    accounts: [],
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
      // Tạo tài khoản
      .addCase(createAccount.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.accountAll.unshift(action.payload);
      })

      // Tìm kiếm tài khoản
      .addCase(searchAccounts.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.accounts = action.payload?.data || [];
        state.pagination = action.payload?.pagination || {
          page: 1,
          size: 10,
          totalElements: 0,
          totalPages: 0,
        };
      })

      // Lấy tài khoản hiện tại
      .addCase(getCurrentAccount.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.current = action.payload;
      })

      // Cập nhật tài khoản
      .addCase(updateAccount.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.accountAll = state.accountAll.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      })

      // Thay đổi trạng thái tài khoản
      .addCase(changeAccountStatus.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.accountAll = state.accountAll.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      })

      // Xóa tài khoản
      .addCase(deleteAccount.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.accountAll = state.accountAll.filter(
          (item: any) => item.id !== action.payload
        );
      })
      .addCase(getAllAccounts.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.accountAll = action.payload || [];
      })
      .addCase(lockAccount.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.accountAll = state.accountAll.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(unlockAccount.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.accountAll = state.accountAll.map((item: any) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
  },
});

export default accountSlice.reducer;
