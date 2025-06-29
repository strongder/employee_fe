"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { useDispatch, useSelector } from "react-redux";
import { createAccount, deleteAccount, getAllAccounts, lockAccount, unlockAccount } from "../../slice/accountSlice";

export default function Accounts() {
  const [open, setOpen] = useState(false);
  const [searchRequest, setSearchRequest] = useState({
    keyword: "",
    role: "ALL",
    status: "ALL",
    page: 1,
    size: 10,
  });
  const [formData, setFormData] = useState({
    username: "",
    employeeCode: "",
    password: "",
    role: "",
    status: "ACTIVE",
  });

  const dispatch = useDispatch();
  const { accountAll } = useSelector((state: any) => state.account);

  useEffect(() => {
    dispatch(getAllAccounts());
  }, [dispatch]);

  // Lọc và tìm kiếm phía frontend
  const filteredAccounts = useMemo(() => {
    let data = accountAll || [];

    // Tìm kiếm theo từ khóa
    if (searchRequest.keyword) {
      data = data.filter((account: any) =>
        account?.employee?.fullName
          ?.toLowerCase()
          .includes(searchRequest.keyword.toLowerCase())
      );
    }

    // Lọc theo vai trò
    if (searchRequest.role !== "ALL") {
      data = data.filter((account: any) => account.role === searchRequest.role);
    }

    // Lọc theo trạng thái
    if (searchRequest.status !== "ALL") {
      data = data.filter(
        (account: any) => account.status === searchRequest.status
      );
    }

    return data;
  }, [accountAll, searchRequest]);

  // Phân trang
  const paginatedAccounts = useMemo(() => {
    const start = (searchRequest.page - 1) * searchRequest.size;
    return filteredAccounts.slice(start, start + searchRequest.size);
  }, [filteredAccounts, searchRequest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    dispatch(createAccount(formData));
    // Reset form
    setFormData({
      username: "",
      employeeCode: "",
      password: "",
      role: "",
      status: "ACTIVE",
    });
  };

  const handleLockAccount = (id: number) => {
    dispatch(lockAccount(id));
  };

  const handleUnlockAccount = (id: number) => {
    dispatch(unlockAccount(id));
  };

  const handleDeleteAccount = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      dispatch(deleteAccount(id)); // Assuming lockAccount is used for deletion
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Quản lý tài khoản</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className=" hover:bg-[#2563eb] ">
              <Plus className="mr-2 h-4 w-4" />
              Thêm tài khoản
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] text-black">
            <DialogHeader>
              <DialogTitle>Thêm tài khoản mới</DialogTitle>
              <DialogDescription>
                Điền thông tin để tạo tài khoản mới trong hệ thống.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right text-black">
                    Tên đăng nhập
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="employeeCode"
                    className="text-right text-black"
                  >
                    Mã nhân viên
                  </Label>
                  <Input
                    id="employeeCode"
                    name="employeeCode"
                    value={formData.employeeCode}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right text-black">
                    Mật khẩu
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right text-black">
                    Vai trò
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                  >
                    <SelectTrigger className="col-span-3 border-[#334155] text-black">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent className=" border-[#334155] text-black">
                      <SelectItem value="MANAGER">Quản trị viên</SelectItem>
                      <SelectItem value="EMPLOYEE">Người dùng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right text-black">
                    Trạng thái
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger className="col-span-3  border-[#334155] text-black">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border-[#334155] text-black">
                      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                      <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className=" hover:bg-[#2563eb] text-white"
                >
                  Lưu
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài khoản</CardTitle>
          <CardDescription className="text-gray-400">
            Quản lý tất cả tài khoản trong hệ thống
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
                    placeholder="Tìm kiếm tài khoản..."
                    className="pl-8 w-[250px]"
                    value={searchRequest.keyword}
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
                  defaultValue="ALL"
                  onValueChange={(value) =>
                    setSearchRequest({ ...searchRequest, role: value })
                  }
                >
                  <SelectTrigger className="w-[180px]  border-[#334155] text-black">
                    <SelectValue placeholder="Vai trò" />
                  </SelectTrigger>
                  <SelectContent className=" border-[#334155] text-black">
                    <SelectItem value="ALL">Tất cả vai trò</SelectItem>
                    <SelectItem value="MANAGER">Quản trị viên</SelectItem>
                    <SelectItem value="EMPLOYEE">Người dùng</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  defaultValue="ALL"
                  onValueChange={(value) =>
                    setSearchRequest({ ...searchRequest, status: value })
                  }
                >
                  <SelectTrigger className="w-[180px] text-black">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent className=" border-[#334155] text-black">
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                    <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Mã nhân viên</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAccounts.map((account: any) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={
                                account?.employee?.avatar
                                  ? account?.employee?.avatar
                                  : `https://ui-avatars.com/api/?name=${account?.employee?.fullName?.charAt(
                                      0
                                    )}&background=random`
                              }
                              alt={account?.employee?.fullName}
                            />
                            <AvatarFallback>
                              {account?.employee.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-black">
                              {account?.employee.fullName}
                            </span>
                            <span className="text-sm text-gray-400">
                              {account?.employee.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{account.role}</TableCell>
                      <TableCell>{account?.employee?.code}</TableCell>
                      <TableCell>{account.createdAt}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            account.status === "ACTIVE"
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                          }
                        >
                          {account.status === "ACTIVE"
                            ? "Hoạt động"
                            : "Không hoạt động"}
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
                            {account.status === "ACTIVE" ? (
                              <DropdownMenuItem className="hover:bg-[#334155]" onClick={() => handleLockAccount(account.id)}>
                                Khóa tài khoản
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="hover:bg-[#334155]" onClick={() => handleUnlockAccount(account.id)}>
                                Kích hoạt tài khoản
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem onClick={() => handleDeleteAccount(account.id)} >Xóa tài khoản</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination
              totalItems={filteredAccounts.length}
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
