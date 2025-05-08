import { ShieldAlert, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/slice/authSlice";

export default function Unauthorized() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Không có quyền truy cập</h1>
        <p className="mt-3 text-base text-gray-500">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
}
