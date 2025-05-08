"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LayoutGrid, Lock, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "@/slice/authSlice";
import { getCurrentAccount } from "@/slice/accountSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Assuming you have a custom hook to get the dispatch function
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Gọi action login từ authSlice
      const resultAction: any = await dispatch(login(formData));
  
      if (login.fulfilled.match(resultAction)) {
        // Lấy role từ Redux hoặc localStorage
        const role = resultAction.payload.user.role || localStorage.getItem("role");
        // dispatch(getCurrentAccount())
        // Điều hướng dựa trên role
        if (role === "MANAGER") {
          navigate("/employees"); // Điều hướng đến trang admin
        } else if (role === "EMPLOYEE") {
          navigate("/user/attendance"); // Điều hướng đến trang user
        }
      } else {
        // Hiển thị lỗi nếu đăng nhập thất bại
        console.error("Login failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <LayoutGrid className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            HR Management System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đăng nhập để truy cập hệ thống
          </p>
        </div>

        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin đăng nhập của bạn để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">
                  Tên đăng nhập
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 bg-white border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">
                    Mật khẩu
                  </Label>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-white border-gray-300"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Liên hệ quản trị viên
              </a>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>© 2025 HR Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}