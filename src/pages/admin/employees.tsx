import type React from "react";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee, getAllEmployee } from "../../slice/employeeSlice.ts";
import { getAllDepartments } from "@/slice/departmentSlice.ts";
import { getAllPositions } from "@/slice/positionSlice.ts";
import { Link } from "react-router-dom";
import { URL_IMAGE } from "../../../api.ts";

export default function Employees() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { employeeAll } = useSelector((state: any) => state.employee);
  const [searchRequest, setSearchRequest] = useState({
    keyword: "",
    department: "ALL",
    status: "ALL",
    page: 1,
    size: 10,
  });

  useEffect(() => {
    // Gọi API để lấy danh sách nhân viên
    dispatch(getAllEmployee());
  }, [dispatch]);

  // Lọc và tìm kiếm phía frontend
  const filteredEmployees = useMemo(() => {
    let data = employeeAll || [];

    // Tìm kiếm theo từ khóa
    if (searchRequest.keyword) {
      data = data.filter((employee: any) =>
        employee.fullName
          .toLowerCase()
          .includes(searchRequest.keyword.toLowerCase())
      );
    }

    // Lọc theo phòng ban
    if (searchRequest.department !== "ALL") {
      data = data.filter(
        (employee: any) => employee.department === searchRequest.department
      );
    }

    // Lọc theo trạng thái
    if (searchRequest.status !== "ALL") {
      data = data.filter(
        (employee: any) => employee.status === searchRequest.status
      );
    }

    return data;
  }, [employeeAll, searchRequest]);

  // Phân trang
  const paginatedEmployees = useMemo(() => {
    const start = (searchRequest.page - 1) * searchRequest.size;
    return filteredEmployees.slice(start, start + searchRequest.size);
  }, [filteredEmployees, searchRequest]);

 
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    address: "",
    email: "",
    phone: "",
    joinDate: "",
    level: "",
    bankName: "",
    bankAccountNumber: "",
    departmentId: 0,
    positionId: 0,
  });

  const departmentAll = useSelector(
    (state: any) => state.department.departmentAll
  ); // giả sử bạn đã có danh sách phòng ban
  console.log(departmentAll);
  const positionAll = useSelector((state: any) => state.position.positionAll); // giả sử bạn đã có danh sách chức vụ
  console.log(departmentAll);

  useEffect(() => {
    dispatch(getAllDepartments());
    dispatch(getAllPositions());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createEmployee(formData)); // gọi action để tạo employee
    setOpen(false); // Đóng dialog sau khi submit
    setFormData({
      fullName: "",
      gender: "",
      dob: "",
      address: "",
      email: "",
      phone: "",
      joinDate: "",
      level: "",
      bankName: "",
      bankAccountNumber: "",
      departmentId: 0,
      positionId: 0,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Quản lý nhân viên</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="hover:bg-[#2563eb]">Thêm nhân viên</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] text-black">
            <DialogHeader className="col-span-2">
              <DialogTitle>Thêm nhân viên mới</DialogTitle>
              <DialogDescription>
                Điền thông tin để tạo nhân viên mới trong hệ thống.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 py-4">
                {/* Full Name */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="fullName" className="text-right text-black">
                    Họ và tên
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>

                {/* Gender */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="gender" className="text-right text-black">
                    Giới tính
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger className="col-span-3 border-[#334155] text-black">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent className="border-[#334155] text-black">
                      <SelectItem value="Male">Nam</SelectItem>
                      <SelectItem value="Female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date of Birth */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="dob" className="text-right text-black">
                    Ngày sinh
                  </Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>

                {/* Address */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="address" className="text-right text-black">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>

                {/* Email */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="email" className="text-right text-black">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="phone" className="text-right text-black">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>

                {/* Skill */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="skill" className="text-right text-black">
                    Ngày vào làm
                  </Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>

                {/* Level */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="level" className="text-right text-black">
                    Cấp độ
                  </Label>
                  <Input
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>

                {/* Bank Name */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="bankName" className="text-right text-black">
                    Tên ngân hàng
                  </Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>

                {/* Bank Account Number */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label
                    htmlFor="bankAccountNumber"
                    className="text-right text-black"
                  >
                    Số tài khoản ngân hàng
                  </Label>
                  <Input
                    id="bankAccountNumber"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>

                {/* Department */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label
                    htmlFor="departmentId"
                    className="text-right text-black"
                  >
                    Phòng ban
                  </Label>
                  <Select
                    value={formData.departmentId.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        departmentId: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3 border-[#334155] text-black">
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent className="border-[#334155] text-black">
                      {departmentAll?.map((department: any) => (
                        <SelectItem
                          key={department.id}
                          value={department.id.toString()}
                        >
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Position */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="positionId" className="text-right text-black">
                    Chức vụ
                  </Label>
                  <Select
                    value={formData.positionId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, positionId: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="col-span-3 border-[#334155] text-black">
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                    <SelectContent className="border-[#334155] text-black">
                      {positionAll?.map((position: any) => (
                        <SelectItem
                          key={position.id}
                          value={position.id.toString()}
                        >
                          {position.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button type="submit" className="hover:bg-[#2563eb] text-white">
                  Lưu
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
          <CardDescription className="text-gray-400">
            Quản lý tất cả nhân viên trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    value={searchRequest.keyword}
                    placeholder="Tìm kiếm nhân viên..."
                    className="pl-8 w-[250px]"
                    onChange={(e) =>
                      setSearchRequest({
                        ...searchRequest,
                        keyword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={searchRequest.department || "ALL"}
                  onValueChange={(value) =>
                    setSearchRequest({
                      ...searchRequest,
                      department: value, // Không cần gán "" khi chọn "ALL"
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px] border-[#334155] text-black">
                    <SelectValue placeholder="Phòng ban" />
                  </SelectTrigger>
                  <SelectContent className="border-[#334155] text-black">
                    <SelectItem value="ALL">Tất cả phòng ban</SelectItem>
                    <SelectItem value="TECH">Kỹ thuật</SelectItem>
                    <SelectItem value="MAKETING">Marketing</SelectItem>
                    <SelectItem value="HR">Nhân sự</SelectItem>
                    <SelectItem value="SALES">Kinh doanh</SelectItem>
                    <SelectItem value="FINACE">Tài chính</SelectItem>
                    <SelectItem value="ADMIN">Hành chính</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={searchRequest.status || "ALL"}
                  onValueChange={(value) =>
                    setSearchRequest({
                      ...searchRequest,
                      status: value, // Không cần gán "" khi chọn "ALL"
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px] text-black">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="border-[#334155] text-black">
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    <SelectItem value="ACTIVE">Đang làm việc</SelectItem>
                    <SelectItem value="INACTIVE">Đã nghỉ việc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Mã nhân viên</TableHead>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead>Chức vụ</TableHead>
                    <TableHead>Ngày vào làm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEmployees &&
                    paginatedEmployees.map((employee: any) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={
                                  employee?.avatar
                                    ? URL_IMAGE + employee?.avatar
                                    : `https://ui-avatars.com/api/?name=${employee?.fullName?.charAt(
                                        0
                                      )}&background=random`
                                }
                                alt={employee?.fullName}
                              />
                              <AvatarFallback>
                                {employee.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-black">
                                {employee.fullName}
                              </span>
                              <span className="text-sm text-gray-400">
                                {employee.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-black">
                          {employee?.code}
                        </TableCell>
                        <TableCell className="text-black">
                          {employee?.department?.name}
                        </TableCell>

                        <TableCell className="text-black">
                          {employee?.position?.name}
                        </TableCell>
                        <TableCell className="text-black">
                          {employee?.joinDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              employee.status === "ACTIVE"
                                ? "bg-green-900 text-green-300"
                                : "bg-red-900 text-red-300"
                            }
                          >
                            {employee.status === "ACTIVE"
                              ? "Đang làm việc"
                              : "Đã nghỉ việc"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-black"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="text-black"
                            >
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="hover:bg-[#334155]">
                                <Link
                                  to={`/employees/${employee.id}`}
                                  className="w-full"
                                >
                                  Xem chi tiết
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-[#334155]">
                                <Link
                                  to={`/employees/${employee.id}`}
                                  className="w-full"
                                >
                                  Chỉnh sửa
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Xóa nhân viên</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <Pagination
              totalItems={filteredEmployees.length}
              itemsPerPage={searchRequest.size}
              currentPage={searchRequest.page}
              onPageChange={(page) =>
                setSearchRequest({ ...searchRequest, page })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
