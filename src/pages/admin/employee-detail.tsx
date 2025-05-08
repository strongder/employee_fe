"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  UserCog,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { findEmployeeById } from "@/slice/employeeSlice";
import { useDispatch, useSelector } from "react-redux";

export default function EmployeeDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { employeeById } = useSelector((state: any) => state.employee);
  useEffect(() => {
    dispatch(findEmployeeById(id));
  }, [dispatch]);
  const employee = employeeById;
  console.log("employee", employee);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const convertStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang làm việc";
      case "INACTIVE":
        return "Nghỉ việc";
      default:
        return status;
    }
  }
  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee?.fullName,
        code: employee?.code,
        gender: employee?.gender==="Male"?"Nam":"Nữ",
        email: employee?.email,
        phone: employee?.phone,
        address: employee?.address,
        dob: employee?.dob,
        status: convertStatus(employee?.status),
        joinDate: employee?.joinDate,
        level: employee?.level,
        bankName: employee?.bankName,
        bankAccountNumber: employee?.bankAccountNumber,
        department: employee?.department?.name,
        position: employee?.position?.name,
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    // Giả lập lưu thông tin
    console.log("Saving profile data:", formData);
    setIsEditing(false);
  };

  return (
    <>
      {employee && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Thông tin cá nhân
            </h1>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-gray-700"
              >
                <User className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-gray-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 bg-white border-gray-200 text-gray-800">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-gray-700 text-3xl font-bold">
                  {employee?.fullName?.charAt(0)}
                </div>
                <CardTitle className="mt-4 text-xl">
                  {employee?.fullName}
                </CardTitle>
              
                <div className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  {employee?.department?.name}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{employee?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formData.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formData.position}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    Ngày vào làm: {formData.joinDate}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="bg-gray-100 border border-gray-200">
                  <TabsTrigger
                    value="info"
                    className="data-[state=active]:bg-white text-gray-800"
                  >
                    Thông tin cá nhân
                  </TabsTrigger>
                  <TabsTrigger
                    value="employment"
                    className="data-[state=active]:bg-white text-gray-800"
                  >
                    Thông tin công việc
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                  <Card className="bg-white border-gray-200 text-gray-800">
                    <CardHeader>
                      <CardTitle>Thông tin cá nhân</CardTitle>
                      <CardDescription className="text-gray-400">
                        Thông tin cơ bản của nhân viên
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-gray-700">
                            Họ và tên
                          </Label>
                          {isEditing ? (
                            <Input
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              className="bg-white border-gray-300 text-gray-800"
                            />
                          ) : (
                            <div className="p-2 rounded bg-gray-50 border border-gray-200">
                              {formData.fullName}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="code" className="text-gray-700">
                            Mã nhân viên
                          </Label>
                          {isEditing ? (
                            <Input
                              id="code"
                              name="code"
                              value={formData.code}
                              onChange={handleChange}
                              className="  text-gray-700"
                              disabled
                            />
                          ) : (
                            <div className="p-2 rounded  border ">
                              {formData.code}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700">
                            Email
                          </Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="  text-gray-700"
                              disabled
                            />
                          ) : (
                            <div className="p-2 rounded  border ">
                              {formData.email}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700">
                            Số điện thoại
                          </Label>
                          {isEditing ? (
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="  text-gray-700"
                            />
                          ) : (
                            <div className="p-2 rounded  border ">
                              {formData.phone}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob" className="text-gray-700">
                            Ngày sinh
                          </Label>
                          {isEditing ? (
                            <Input
                              id="dob"
                              name="dob"
                              value={formData.dob}
                              onChange={handleChange}
                              className="  text-gray-700"
                            />
                          ) : (
                            <div className="p-2 rounded  border ">
                              {formData.dob}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender" className="text-gray-700">
                            Giới tính
                          </Label>
                          {isEditing ? (
                            <Input
                              id="gender"
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              className="  text-gray-700"
                            />
                          ) : (
                            <div className="p-2 rounded  border ">
                              {formData.gender}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-gray-700">
                            Địa chỉ
                          </Label>
                          {isEditing ? (
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              className="  text-gray-700"
                            />
                          ) : (
                            <div className="p-2 rounded  border ">
                              {formData.address}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status" className="text-gray-700">
                            Trạng thái
                          </Label>
                          <div className="p-2 rounded  border ">
                            {formData.status}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="employment">
                  <Card className="bg-white border-gray-200 text-gray-800">
                    <CardHeader>
                      <CardTitle>Thông tin công việc</CardTitle>
                      <CardDescription className="text-gray-400">
                        Chi tiết về vị trí và phòng ban
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department" className="text-gray-700">
                            Phòng ban
                          </Label>
                          <div className="p-2 rounded bg-gray-50 border border-gray-200">
                            {formData.department}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position" className="text-gray-700">
                            Chức vụ
                          </Label>
                          <div className="p-2 rounded  border ">
                            {formData.position}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="level" className="text-gray-700">
                            Cấp bậc
                          </Label>
                          {isEditing ? (
                            <Input
                              id="level"
                              name="level"
                              value={formData.level}
                              onChange={handleChange}
                              className="bg-white border-gray-300 text-gray-800"
                            />
                          ) : (
                            <div className="p-2 rounded  border ">
                              {formData.level}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="joinDate" className="text-gray-700">
                            Ngày vào làm
                          </Label>
                          <div className="p-2 rounded  border ">
                            {formData.joinDate}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bankName" className="text-gray-700">
                            Tên ngân hàng
                          </Label>
                          {isEditing ? (
                            <Input
                              id="bankName"
                              name="bankName"
                              value={formData.bankName}
                              onChange={handleChange}
                              className="  text-gray-700"
                            />
                          ) : (
                            <div className="p-2 rounded  border ">
                              {formData.bankName}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="bankAccountNumber"
                            className="text-gray-700"
                          >
                            Số tài khoản
                          </Label>
                          {isEditing ? (
                            <Input
                              id="bankAccountNumber"
                              name="bankAccountNumber"
                              value={formData.bankAccountNumber}
                              onChange={handleChange}
                              className="  text-gray-700"
                            />
                          ) : (
                            <div className="p-2 rounded  border ">
                              {formData.bankAccountNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
