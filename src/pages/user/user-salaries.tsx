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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Pagination } from "@/components/pagination";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getByEmployee,
} from "@/slice/salarySlice";

export default function UserSalaries() {
  const dispatch = useDispatch();
  const { salaryByEmployee, loading, error } = useSelector(
    (state: any) => state.salary
  );
  const [searchRequest, setSearchRequest] = useState({
    keyword: "",
    page: 1,
    size: 3,
    month: "ALL",
    status: "ALL",
  });

  useEffect(() => {
    const employeeId = localStorage.getItem("userId");
    if (employeeId) {
      dispatch(getByEmployee(employeeId));
    }
  }, [dispatch]);

  // Filter, search, paginate phía frontend
  const filteredSalaries = React.useMemo(() => {
    let data = salaryByEmployee || [];
    // Lọc theo keyword
    if (searchRequest.keyword) {
      data = data.filter(
        (item: any) =>
          item.employee?.fullName
            ?.toLowerCase()
            .includes(searchRequest.keyword.toLowerCase()) ||
          item.employee?.code
            ?.toLowerCase()
            .includes(searchRequest.keyword.toLowerCase())
      );
    }
    // Lọc theo tháng (dựa vào paymentDate)
    if (searchRequest.month && searchRequest.month !== "ALL") {
      data = data.filter(
        (item: any) => item.paymentDate?.slice(0, 7) === searchRequest.month
      );
    }
    // Lọc theo trạng thái
    if (searchRequest.status && searchRequest.status !== "ALL") {
      data = data.filter((item: any) => item.status === searchRequest.status);
    }
    return data;
  }, [salaryByEmployee, searchRequest]);

  // Phân trang phía frontend
  const paginatedSalaries = React.useMemo(() => {
    const start = (searchRequest.page - 1) * searchRequest.size;
    return filteredSalaries.slice(start, start + searchRequest.size);
  }, [filteredSalaries, searchRequest.page, searchRequest.size]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {/* <h1 className="text-2xl font-bold">Quản lý lương</h1>
        <Button onClick={openAddModal}>+ Thêm lương</Button> */}
      </div>
      {loading && <div className="text-blue-600">Đang tải dữ liệu...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lương</CardTitle>
          <CardDescription>Thông tin lương của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2 items-center"></div>
              <div className="flex gap-2 items-center">
                <input
                  type="month"
                  value={searchRequest.month}
                  onChange={(e) =>
                    setSearchRequest({
                      ...searchRequest,
                      month: e.target.value,
                      page: 1,
                    })
                  }
                  className="border rounded px-2 py-1"
                  style={{ width: 180 }}
                />
                <Select
                  value={searchRequest.status || "ALL"}
                  onValueChange={(value) =>
                    setSearchRequest({
                      ...searchRequest,
                      status: value === "ALL" ? "" : value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    <SelectItem value="PAID">Đã thanh toán</SelectItem>
                    <SelectItem value="PENDING">Chưa thanh toán</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>{" "}
                    <TableHead>Lương cơ bản</TableHead>
                    <TableHead>Thưởng</TableHead>
                    <TableHead>Phụ cấp</TableHead>
                    <TableHead>Khấu trừ</TableHead>
                    <TableHead>Thực lãnh</TableHead>
                    <TableHead>Ngày thanh toán</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSalaries &&
                    paginatedSalaries.map((salary: any) => (
                      <TableRow key={salary.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={`https://ui-avatars.com/api/?name=${
                                  salary.employee?.fullName?.charAt(0) || "?"
                                }&background=random`}
                                alt={salary.employee?.name || "?"}
                              />
                              <AvatarFallback>
                                {salary.employee?.fullName?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {salary.employee?.fullName}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {salary.employee?.code}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {salary.baseSalary?.toLocaleString()} VND
                        </TableCell>
                        <TableCell>
                          {salary.bonusAmount?.toLocaleString()} VND
                        </TableCell>
                        <TableCell>
                          {salary.allowanceAmount?.toLocaleString()} VND
                        </TableCell>
                        <TableCell>
                          {salary.deductionAmount?.toLocaleString()} VND
                        </TableCell>
                        <TableCell className="font-medium">
                          {salary.totalSalary?.toLocaleString()} VND
                        </TableCell>
                        <TableCell>
                          {salary.paymentDate
                            ? new Date(salary.paymentDate).toLocaleDateString()
                            : ""}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              salary.status === "PAID" ? "default" : "outline"
                            }
                          >
                            {salary.status === "PAID"
                              ? "Đã thanh toán"
                              : salary.status === "PENDING"
                              ? "Chưa thanh toán"
                              : "Đã hủy"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <Pagination
              totalItems={filteredSalaries.length}
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
