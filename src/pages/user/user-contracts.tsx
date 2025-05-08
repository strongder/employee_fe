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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Pagination } from "@/components/pagination";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getByEmployee } from "@/slice/contractSlice";
import React from "react";
import api from "../../../api";

export default function UserContracts() {
  const [searchRequest, setSearchRequest] = useState({
    keyword: "",
    page: 1,
    size: 10,
    contractType: "ALL",
    status: "ALL",
  });

  const dispatch: any = useDispatch();
  const { contractByEmployee } = useSelector((state: any) => state.contract);
  // Dummy contracts để tránh lỗi render
  useEffect(() => {
    const employeeId = localStorage.getItem("userId");
    if (employeeId) {
      dispatch(getByEmployee(employeeId));
    }
  }, [dispatch]);

  // Filter, search, paginate phía frontend
  const filteredContracts = React.useMemo(() => {
    let data = contractByEmployee || [];
    if (searchRequest.keyword) {
      data = data.filter(
        (item: any) =>
          item.employeeName
            ?.toLowerCase()
            .includes(searchRequest.keyword.toLowerCase()) ||
          item.employeeCode
            ?.toLowerCase()
            .includes(searchRequest.keyword.toLowerCase())
      );
    }
    if (searchRequest.contractType !== "ALL") {
      data = data.filter(
        (item: any) => item.contractType === searchRequest.contractType
      );
    }
    if (searchRequest.status !== "ALL") {
      data = data.filter((item: any) => item.status === searchRequest.status);
    }
    return data;
  }, [contractByEmployee, searchRequest]);

  const paginatedContracts = React.useMemo(() => {
    const start = (searchRequest.page - 1) * searchRequest.size;
    return filteredContracts.slice(start, start + searchRequest.size);
  }, [filteredContracts, searchRequest.page, searchRequest.size]);

  const handleDownload = async (contract: any) => {
    try {
      // Gọi API để lấy file dưới dạng blob
      const response = await api.get(
        `/files/download/${contract.contractUrl}`,
        {
          responseType: "blob", // Quan trọng để nhận file nhị phân
        }
      );

      // Lấy tên file từ header (nếu backend trả về)
      let fileName = contract.contractUrl;
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.indexOf("filename*=UTF-8''") !== -1) {
        fileName = decodeURIComponent(
          disposition.split("filename*=UTF-8''")[1]
        );
      }

      // Tạo URL tạm cho file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Đặt tên file khi tải về
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Tải file thất bại!");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hợp đồng</CardTitle>
          <CardDescription>Thông tin hợp đồng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2 items-center"></div>
              <div className="flex gap-2">
                <Select
                  value={searchRequest.contractType}
                  onValueChange={(value) =>
                    setSearchRequest({
                      ...searchRequest,
                      contractType: value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Loại hợp đồng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả loại</SelectItem>
                    <SelectItem value="FULL_TIME">Toàn thời gian</SelectItem>
                    <SelectItem value="PART_TIME">Bán thời gian</SelectItem>
                    <SelectItem value="INTERNSHIP">Thực tập</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={searchRequest.status}
                  onValueChange={(value) =>
                    setSearchRequest({
                      ...searchRequest,
                      status: value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    <SelectItem value="ACTIVE">Đang hiệu lực</SelectItem>
                    <SelectItem value="INACTIVE">Hết hạn</SelectItem>
                    <SelectItem value="TERMINATED">Đã chấm dứt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã hợp đồng</TableHead>
                    <TableHead>Mã nhân viên</TableHead>
                    <TableHead>Loại hợp đồng</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead>Lương cơ bản</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContracts &&
                    paginatedContracts.map((contract: any) => (
                      <TableRow key={contract.id}>
                        <TableCell>{contract.contractCode}</TableCell>
                        <TableCell>{contract?.employee?.code}</TableCell>
                        <TableCell>{contract.contractType}</TableCell>
                        <TableCell>{contract.startDate}</TableCell>
                        <TableCell>{contract.endDate}</TableCell>
                        <TableCell>
                          {contract.monthlySalary?.toLocaleString()} VND
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              contract.contractStatus === "ACTIVE"
                                ? "default"
                                : contract.contractStatus === "INACTIVE"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {contract.contractStatus === "ACTIVE" &&
                              "Đang hiệu lực"}
                            {contract.contractStatus === "INACTIVE" &&
                              "Hết hạn"}
                            {contract.contractStatus === "TERMINATED" &&
                              "Đã chấm dứt"}
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

                              <DropdownMenuItem
                                onClick={() => handleDownload(contract)}
                              >
                                Tải xuống
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
              totalItems={filteredContracts.length}
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
