"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Lock,
  Save,
  Briefcase,
  Calendar,
  RollerCoaster,
  Camera,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, getCurrentAccount } from "@/slice/accountSlice";
import { changeAvatar, updateEmployee } from "@/slice/employeeSlice";
import { URL_IMAGE } from "../../api";

export default function Profile() {
  const dispatch = useDispatch();
  const { current } = useSelector((state: any) => state.account);
  useEffect(() => {
    dispatch(getCurrentAccount());
  }, [dispatch]);
  const employee = current.employee;
  console.log("employee", employee);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [formDataAccount, setFormDataAccount] = useState<any>({});
  const fileInputRef = useRef<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<any>(null); // backend cần trả avatarUrl nếu có

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee?.fullName || "",
        code: employee?.code,
        gender: employee?.gender,
        email: employee?.email,
        phone: employee?.phone,
        address: employee?.address,
        dob: employee?.dob,
        status: employee?.status,
        joinDate: employee?.joinDate,
        level: employee?.level,
        bankName: employee?.bankName,
        bankAccountNumber: employee?.bankAccountNumber,
        departmentId: employee?.department?.id,
        positionId: employee?.position?.id,
      });
      setAvatarUrl(URL_IMAGE + employee?.avatar);
    }
    if (current) {
      setFormDataAccount({
        username: current.username,
        role: current.role,
        status: current.status,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleChangeAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataAccount((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    const employeeId = localStorage.getItem("userId");
    const updatedData = formData;
    dispatch(updateEmployee({ employeeId, updatedData })).then(() => {
      setIsEditing(false);
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formDataAccount;
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    const data = {
      username: formDataAccount.username,
      currentPassword,
      newPassword,
    };
    dispatch(changePassword(data))
      .then(() => {
        alert("Đổi mật khẩu thành công!");
      })
      .catch((error: any) => {
        alert("Đổi mật khẩu thất bại: " + error.message);
      });

    // Reset form
    setFormDataAccount((prev: any) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("employeeId", employee.id);
    formDataUpload.append("avatar", file);

    const res = await dispatch<any>(changeAvatar(formDataUpload));
    const fileName = res.payload;
    if (fileName) {
      const fullUrl = URL_IMAGE + fileName;
      setAvatarUrl(fullUrl); // Gán vào state để hiển thị
    } else {
      alert("Đổi ảnh thành công nhưng không nhận được tên file!");
    }
  };

  return (
    <>
      {current && employee && (
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
              <CardHeader className="flex flex-col items-center text-center relative">
                <div
                  className="relative h-24 w-24 cursor-pointer rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center overflow-hidden"
                  onClick={handleAvatarClick}
                  title="Click để đổi avatar"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="object-cover h-full w-full rounded-full"
                    />
                  ) : (
                    employee?.fullName?.charAt(0)
                  )}
                  <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
                    <Camera className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <CardTitle className="mt-4 text-xl">
                  {employee?.fullName}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {employee?.role === "STAFF" ? "Nhân viên" : "Quản lý"}
                </CardDescription>
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
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-white text-gray-800"
                  >
                    Tài khoản
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
                            {employee.department.name}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position" className="text-gray-700">
                            Chức vụ
                          </Label>
                          <div className="p-2 rounded  border ">
                            {employee.position.name}
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

                <TabsContent value="security">
                  <Card className="bg-white border-gray-200 text-gray-800">
                    <CardHeader>
                      <CardTitle>Tài khoản</CardTitle>
                      <CardDescription className="text-gray-500">
                        Thay đổi mật khẩu của bạn
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={handlePasswordChange}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-6">
                          {/* Cột 1 */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="username"
                                className="text-gray-700"
                              >
                                Tên đăng nhập
                              </Label>
                              <div className="relative">
                                <Input
                                  id="username"
                                  name="username"
                                  type="text"
                                  value={formDataAccount.username}
                                  onChange={handleChangeAccount}
                                  className="bg-white border-gray-300 text-gray-800"
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="role" className="text-gray-700">
                                Vai trò
                              </Label>
                              <div className="relative">
                                <Input
                                  id="role"
                                  name="role"
                                  type="text"
                                  value={formDataAccount.role}
                                  onChange={handleChange}
                                  className="bg-gray-100 border-gray-300 text-gray-800"
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="status" className="text-gray-700">
                                Trạng thái
                              </Label>
                              <div className="relative">
                                <Input
                                  id="status"
                                  name="status"
                                  type="text"
                                  value={formDataAccount.status}
                                  onChange={handleChange}
                                  className="bg-gray-100 border-gray-300 text-gray-800"
                                  disabled
                                />
                              </div>
                            </div>
                          </div>

                          {/* Cột 2 */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="currentPassword"
                                className="text-gray-700"
                              >
                                Mật khẩu hiện tại
                              </Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  id="currentPassword"
                                  name="currentPassword"
                                  type="password"
                                  value={formDataAccount.currentPassword}
                                  onChange={handleChangeAccount}
                                  className="pl-10 bg-white border-gray-300 text-gray-800"
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="newPassword"
                                className="text-gray-700"
                              >
                                Mật khẩu mới
                              </Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  id="newPassword"
                                  name="newPassword"
                                  type="password"
                                  value={formDataAccount.newPassword}
                                  onChange={handleChangeAccount}
                                  className="pl-10 bg-white border-gray-300 text-gray-800"
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="confirmPassword"
                                className="text-gray-700"
                              >
                                Xác nhận mật khẩu mới
                              </Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type="password"
                                  value={formDataAccount.confirmPassword}
                                  onChange={handleChangeAccount}
                                  className="pl-10 bg-white border-gray-300 text-gray-800"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardFooter className="px-0 pt-4">
                          <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Đổi mật khẩu
                          </Button>
                        </CardFooter>
                      </form>
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
