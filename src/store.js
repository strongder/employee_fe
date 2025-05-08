// store.js
import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slice/employeeSlice.ts';
import accoutReducer from './slice/accountSlice.ts'; // Đường dẫn đến file slice của bạn
import leaveRequestReducer from './slice/leaveRequestSlice.ts'; // Đường dẫn đến file slice của bạn
import departmentReducer from './slice/departmentSlice.ts'; // Đường dẫn đến file slice của bạn
import positionReducer from './slice/positionSlice.ts'; // Đường dẫn đến file slice của bạn
import contractReducer from './slice/contractSlice.ts';
import salaryReducer from './slice/salarySlice.ts'
import authReducer from './slice/authSlice.ts'; // Đường dẫn đến file slice của bạn
import bonusReducer from './slice/bonusSlice.ts'
import attendanceReducer from './slice/attendanceSlice.ts'; // Đường dẫn đến file slice của bạn
// Đường dẫn đến file slice của bạn
 // Đường dẫn đến file slice của bạn

const store = configureStore({
  reducer: {
    auth: authReducer,
     // Đường dẫn đến file slice của bạn
    employee: employeeReducer,
    account: accoutReducer,
    attendance: attendanceReducer,
    leaveRequest: leaveRequestReducer,
    bonus: bonusReducer,
    department: departmentReducer,
    position: positionReducer,
    contract: contractReducer,
    salary: salaryReducer,
  },
});

export default store;
