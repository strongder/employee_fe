import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/dashboard";
import Employees from "./pages/admin/employees";
import Attendance from "./pages/admin/attendance";
import LeaveRequests from "./pages/admin/leave-requests";
import Bonuses from "./pages/admin/bonuses";
import Salaries from "./pages/admin/salaries";
import Contracts from "./pages/admin/contracts";
import Departments from "./pages/admin/departments";
import Positions from "./pages/admin/positions";
import Reports from "./pages/admin/reports";
import Accounts from "./pages/admin/account";
import EmployeeDetail from "./pages/admin/employee-detail";
import Login from "./pages/login";
import UserAttendance from "./pages/user/user-attendance";
import ProtectedRoute from "./router/protected-router";
import AdminLayout from "./layout/admin-layout";
import UserLayout from "./layout/user-layout";
import Unauthorized from "./pages/unauthorized";
import Profile from "./pages/profile";
import UserLeaveRequest from "./pages/user/user-leave-request";
import UserSalaries from "./pages/user/user-salaries";
import UserBonuses from "./pages/user/user-bonuses";
import UserContracts from "./pages/user/user-contracts";
// import UserBonuses from "./pages/user/user-bonuses"


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* Protected route cho Admin */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Employees />} />
        <Route path="account" element={<Accounts />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="employees" element={<Employees />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave-requests" element={<LeaveRequests />} />
        <Route path="bonuses" element={<Bonuses />} />
        <Route path="salaries" element={<Salaries />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="departments" element={<Departments />} />
        <Route path="positions" element={<Positions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Protected route cho User (nếu có layout riêng, tạo thêm UserLayout) */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="attendance" element={<UserAttendance />} />
        <Route path="leave-requests" element={<UserLeaveRequest />} />
        <Route path="salaries" element={<UserSalaries />} />
        <Route path="bonuses" element={<UserBonuses />} />
        <Route path="contracts" element={<UserContracts />} />
        <Route path="profile" element={<Profile />} />

        {/* <Route path="bonuses" element={<UserBonuses />} /> */}
      </Route>
    </Routes>
  );
}
export default App;
