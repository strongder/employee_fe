import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";


function buildFormData(data: any): FormData {
  const formData = new FormData();
  if (data.id) formData.append("id", String(data.id));
  if (data.employeeCode) formData.append("employeeCode", data.employeeCode);
  if (data.startDate) formData.append("startDate", data.startDate);
  if (data.endDate) formData.append("endDate", data.endDate);
  if (data.contractType) formData.append("contractType", data.contractType);
  if (data.contractStatus) formData.append("contractStatus", data.contractStatus);
  if (data.monthlySalary) formData.append("monthlySalary", String(data.monthlySalary));
  if (data.contractFile) formData.append("contractFile", data.contractFile);
  return formData;
}
export const createContract = createAsyncThunk(
  "contract/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = buildFormData(data);
      const res = await api.post("/contracts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateContract = createAsyncThunk(
  "contract/update",
  async (
    { id, updatedData }: { id: any; updatedData: any },
    { rejectWithValue }
  ) => {
    try {
      const formData = buildFormData(updatedData);
      const res = await api.put(`/contracts/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// 2. Tìm kiếm hợp đồng
export const searchContracts: any = createAsyncThunk(
  "contract/search",
  async (criteria, { rejectWithValue }) => {
    try {
      const res = await api.post("/contracts/search", criteria);
      return res.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. Lấy hợp đồng theo ID
export const getContractById = createAsyncThunk(
  "contract/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/contracts/${id}`);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



// 5. Xóa hợp đồng
export const deleteContract: any = createAsyncThunk(
  "contract/delete",
  async (id: any, { rejectWithValue }) => {
    try {
      await api.delete(`/contracts/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3. getAll
export const getAllContract: any = createAsyncThunk(
  "contract/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/contracts/all`);
      return res.data?.result;
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
      const res = await api.get(`/contracts/${id}/employee`);
      console.log(res.data?.result);
      return res?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const contractSlice = createSlice({
  name: "contract",
  initialState: {
    contractAll: [],
    contracts: [],
    pagination: {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
    current: {},
    contractByEmployee: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createContract.fulfilled, (state: any, action: any) => {
        state.contractAll.unshift(action.payload);
      })
      .addCase(searchContracts.fulfilled, (state, action) => {
        state.contracts = action.payload?.data || [];
        state.pagination = action.payload?.pagination || {
          page: 1,
          size: 10,
          totalElements: 0,
          totalPages: 0,
        };
      })
      .addCase(getContractById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(updateContract.fulfilled, (state: any, action) => {
        state.contractAll = state.contractAll.map((ct: any) =>
          ct.id === action.payload.id ? action.payload : ct
        );
      })
      .addCase(getAllContract.fulfilled, (state: any, action: any) => {
        state.contractAll = action.payload;
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.contractAll = state.contractAll.filter(
          (ct: any) => ct.id !== action.payload
        );
      })
      .addCase(getByEmployee.fulfilled, (state, action) => {
        state.contractByEmployee = action.payload || [];
      });
  },
});

export default contractSlice.reducer;
