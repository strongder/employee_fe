"use client";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MoreHorizontal, Search } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { vi } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAttendance, getAllAttendance } from "@/slice/attendanceSlice";
import { URL_IMAGE } from "../../../api";
import { getAllDepartments } from "@/slice/departmentSlice";

export default function Attendance() {
  const dispatch = useDispatch();
  const { attendanceAll, loading } = useSelector(
    (state: any) => state.attendance
  );
  const { departmentAll } = useSelector((state: any) => state.department);
  const [searchRequest, setSearchRequest] = useState({
    keyword: "",
    department: "ALL",
    status: "ALL",
    date: null as Date | null,
    page: 1,
    size: 10,
  });

  const [filteredAttendance, setFilteredAttendance] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getAllAttendance());
    dispatch(getAllDepartments());
  }, [dispatch]);

  useEffect(() => {
    let data = attendanceAll;
    console.log("Attendance data:", data);
    // Tìm kiếm theo từ khóa
    if (searchRequest.keyword) {
      data = data.filter(
        (record: any) =>
          record.employee.fullName
            ?.toLowerCase()
            .includes(searchRequest.keyword.toLowerCase()) ||
          record.employee.code
            ?.toLowerCase()
            .includes(searchRequest.keyword.toLowerCase())
      );
    }

    // Lọc theo phòng ban
    if (searchRequest.department !== "ALL") {
      console.log("Filtering by department:", searchRequest);
      data = data.filter(
        (record: any) => record.employee.department?.id == searchRequest.department
      );
    }

    // Lọc theo trạng thái
    if (searchRequest.status !== "ALL") {
      data = data.filter(
        (record: any) => record.status === searchRequest.status
      );
    }

    // Lọc theo ngày
    if (searchRequest.date) {
      data = data.filter(
        (record: any) =>
          record.date === searchRequest?.date?.toISOString().split("T")[0]
      );
    }

    setFilteredAttendance(data);
  }, [attendanceAll, searchRequest]);

  // Phân trang
  const paginatedAttendance = filteredAttendance.slice(
    (searchRequest.page - 1) * searchRequest.size,
    searchRequest.page * searchRequest.size
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chấm công này?")) {
      dispatch(deleteAttendance(id));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chấm công nhân viên</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chấm công</CardTitle>
          <CardDescription>
            Quản lý thông tin chấm công của nhân viên
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
                    placeholder="Tìm kiếm nhân viên..."
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>
                        {searchRequest.date
                          ? searchRequest.date.toLocaleDateString("vi-VN")
                          : "Chọn ngày"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={vi}
                      selected={searchRequest.date || undefined}
                      onSelect={(date) =>
                        setSearchRequest({
                          ...searchRequest,
                          date: date || null,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex gap-2">
                <Select
                  defaultValue="ALL"
                  onValueChange={(value) =>
                    setSearchRequest({ ...searchRequest, department: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả phòng ban</SelectItem>
                    {departmentAll.map((department: any) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  defaultValue="ALL"
                  onValueChange={(value) =>
                    setSearchRequest({ ...searchRequest, status: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    <SelectItem value="PRESENT">Đúng giờ</SelectItem>
                    <SelectItem value="LATE">Đi muộn</SelectItem>
                    <SelectItem value="EARLY_LEAVE">Về sớm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Giờ làm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAttendance.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={
                                record?.employee?.avatar
                                  ? URL_IMAGE + record?.employee?.avatar
                                  : `https://ui-avatars.com/api/?name=${record?.employee?.fullName?.charAt(
                                      0
                                    )}&background=random`
                              }
                              alt={record?.employee?.fullName}
                            />
                            <AvatarFallback>
                              {record?.employee?.fullName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {record?.employee?.fullName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {record?.employee?.code}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record?.employee?.department?.name}
                      </TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>{record.workHours}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "PRESENT"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {record.status === "PRESENT" ? "Đúng giờ" : "Đi muộn"}
                        </Badge>
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
                            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(record.id)}
                            >
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination
              totalItems={filteredAttendance.length}
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
