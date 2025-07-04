"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination"; // Assuming you have a pagination component
import { useDispatch, useSelector } from "react-redux";
import {
  createDepartment,
  deleteDepartment,
  searchDepartments,
  updateDepartment,
} from "@/slice/departmentSlice";
import { SearchRequest } from "@/util/searchRequest";

interface Department {
  name: string;
  description: string;
}

export default function DepartmentManagement() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });

  const { departments, pagination } = useSelector(
    (state: any) => state.department
  );
  const [searchRequest, setSearchRequest] = useState<any>({
    keyword: "name",
    value: "",
    page: 1,
    size: 10,
    sortBy: "createdAt",
    sortDir: "desc",
  });
  const filteredDepartment = useMemo(() => {
    let data = departments || [];
    if (searchRequest.value) {
      data = data.filter((department: any) =>
        department[searchRequest.keyword]
          .toLowerCase()
          .includes(searchRequest.value.toLowerCase())
      );
    }
    return data;
  }, [departments, searchRequest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    dispatch(searchDepartments(searchRequest));
  }, [dispatch]);

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode && formData.id) {
      dispatch(updateDepartment({ id: formData.id, updatedData: formData }));
      alert("Cập nhật phòng ban thành công");
    } else {
      dispatch(createDepartment({ name: formData.name, description: formData.description }));
      alert("Thêm phòng ban thành công");
    }
    setFormData({ id: "", name: "", description: "" });
    setOpen(false);
    setEditMode(false);
  };
  const handleEdit = (department: any) => {
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description,
    });
    setEditMode(true);
    setOpen(true);
  };
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) {
      dispatch(deleteDepartment(id));
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý phòng ban</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Thêm phòng ban
            </Button>
          </DialogTrigger>
           <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editMode ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}</DialogTitle>
              <DialogDescription>
                {editMode
                  ? "Chỉnh sửa lại thông tin phòng ban"
                  : "Điền thông tin để tạo phòng ban mới trong hệ thống."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-4 py-4">
                {/* Department Name */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="name" className="text-right">
                    Tên phòng ban
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                {/* Description */}
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="description" className="text-right">
                    Mô tả
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Lưu
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng ban</CardTitle>
          <CardDescription>
            Quản lý thông tin các phòng ban trong công ty
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
                    placeholder="Tìm kiếm phòng ban..."
                    className="pl-8 w-[250px]"
                    onChange={(e) =>
                      setSearchRequest((prev:any) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên phòng ban</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartment.map((department: any) => (
                      <TableRow key={department.id}>
                        <TableCell className="font-medium">
                          {department.name}
                        </TableCell>
                        <TableCell>
                          <span className="truncate max-w-[200px] block">
                            {department.description}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(department)}>
                              Chỉnh sửa
                            </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  handleDelete(department.id);
                                }}
                              >
                                Xóa phòng ban
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Pagination
                totalItems={pagination?.totalPages}
                itemsPerPage={10}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
