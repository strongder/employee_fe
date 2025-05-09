"use client";

import type React from "react";

import { useEffect, useState } from "react";
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

import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { SearchRequest } from "@/util/searchRequest";
import { useDispatch, useSelector } from "react-redux";
import { createPosition, searchPositions } from "@/slice/positionSlice";

export default function Positions() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [searchRequest, setSearchRequest] = useState<SearchRequest>({
    keyword: "",
    page: 1,
    size: 10,
    sortBy: "createdAt",
    sortDir: "desc",
  });
  const { positions, pagination } = useSelector((state: any) => state.position);

  useEffect(() => {
    dispatch(searchPositions(searchRequest));
  }, [searchRequest, dispatch]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPosition = {
      name: formData.name,
      description: formData.description,
    };
    dispatch(createPosition(newPosition));
    setOpen(false);
    setFormData({
      name: "",
      description: "",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Quản lý chức vụ</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-black">
              <Plus className="mr-2 h-4 w-4" />
              Thêm chức vụ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] text-black border-[#334155]">
            <DialogHeader>
              <DialogTitle>Thêm chức vụ mới</DialogTitle>
              <DialogDescription>
                Điền thông tin để tạo chức vụ mới trong hệ thống.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-black">
                    Tên chức vụ
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="description"
                    className="text-right text-black"
                  >
                    Mô tả
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="col-span-3 border-[#334155] text-black"
                  />
                </div>
              </div>
              <DialogFooter>
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
          <CardTitle>Danh sách chức vụ</CardTitle>
          <CardDescription className="text-gray-400">
            Quản lý thông tin các chức vụ trong công ty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm chức vụ..."
                  className="pl-8 w-[250px] text-black"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên chức vụ</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions &&
                    positions.map((position: any) => (
                      <TableRow key={position.id}>
                        <TableCell className="font-medium text-black">
                          {position.name}
                        </TableCell>
                        <TableCell className="text-black">
                          <span className="truncate max-w-[300px] block">
                            {position.description}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-black hover:bg-[#334155]"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Xóa chức vụ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <Pagination totalItems={pagination?.totalPages} itemsPerPage={10} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
