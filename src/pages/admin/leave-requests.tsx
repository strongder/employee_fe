import React, { useState, useMemo, useEffect } from "react";
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
import { MoreHorizontal, Search } from "lucide-react";
import { Pagination } from "@/components/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";
import { changeStatus, deleteLeaveRequest, getAllLeaveRequest } from "@/slice/leaveRequestSlice";
import { URL_IMAGE } from "../../../api";

export default function LeaveRequests() {
  const dispatch = useDispatch();
  const { leaveRequestAll } = useSelector((state: any) => state.leaveRequest);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  // Lọc và tìm kiếm
  const filteredRequests = useMemo(() => {
    let data = leaveRequestAll || [];
    if (search) {
      data = data.filter(
        (item: any) =>
          item?.employee?.fullName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item?.employee?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      data = data.filter((item: any) => item.status === statusFilter);
    }
    return data;
  }, [leaveRequestAll, search, statusFilter]);
  useEffect(() => {
    dispatch(getAllLeaveRequest());
  }, [dispatch]);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  const handleShowDetail = (request: any) => {
    console.log(request);
    setDetailData(request);
    setShowDetail(true);
  };

  const handleAccept = (id: number) => {
    dispatch(changeStatus({ leaveRequestId: id, status: "APPROVED" }));
    setShowDetail(false);
  };
  const handleReject = (id: number) => {
    dispatch(changeStatus({ leaveRequestId: id, status: "REJECTED" }));
    setShowDetail(false);
  };

  const handleDelete: any = (id: number) => {
    dispatch(deleteLeaveRequest(id));
    alert("Xóa thành công");
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Duyệt đơn nghỉ phép</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn xin nghỉ phép</CardTitle>
          <CardDescription>
            Quản lý và duyệt đơn xin nghỉ phép của nhân viên
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
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                    <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                    <SelectItem value="REJECTED">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Từ ngày</TableHead>
                    <TableHead>Số ngày</TableHead>
                    <TableHead>Lý do</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((request: any) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={
                                request?.employee?.avatar
                                  ? URL_IMAGE + request?.employee?.avatar
                                  : `https://ui-avatars.com/api/?name=${request?.employee?.fullName?.charAt(
                                      0
                                    )}&background=random`
                              }
                              alt={request?.employee?.fullName}
                            />
                            <AvatarFallback>
                              {request?.employee?.fullName?.charAt(0) || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {request?.employee?.fullName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {request?.employee?.code}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.leaveDate}</TableCell>
                      <TableCell>{request.numberOfDays}</TableCell>
                      <TableCell>
                        <span className="truncate max-w-[150px] block">
                          {request.reason}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "PENDING"
                              ? "outline"
                              : request.status === "APPROVED"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {request.status === "PENDING" && "Chờ duyệt"}
                          {request.status === "APPROVED" && "Đã duyệt"}
                          {request.status === "REJECTED" && "Từ chối"}
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
                              onClick={() => handleShowDetail(request)}
                            >
                              Xem chi tiết
                            </DropdownMenuItem>
                            {request.status === "PENDING" && (
                              <>
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => handleAccept(request.id)}
                                >
                                  Chấp nhận
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleReject(request.id)}
                                >
                                  Từ chối
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                handleDelete(request.id);
                              }}>
                              Xóa đơn
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
              totalItems={filteredRequests.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog xem chi tiết */}
      {detailData && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-2xl sm:max-w-[800px] max-h-[80vh] overflow-y-auto text-black">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn xin nghỉ phép</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <div>
                <label className="font-medium">Nhân viên</label>
                <Input value={detailData?.employee?.fullName} disabled />
              </div>
              <div>
                <label className="font-medium">Mã nhân viên</label>
                <Input value={detailData?.employee?.code} disabled />
              </div>
              <div>
                <label className="font-medium">Từ ngày</label>
                <Input value={detailData.leaveDate} disabled />
              </div>
              <div>
                <label className="font-medium">Số ngày nghỉ</label>
                <Input value={detailData.numberOfDays} disabled />
              </div>
              <div>
                <label className="font-medium">Lý do</label>
                <Input value={detailData.reason} disabled />
              </div>
              <div>
                <label className="font-medium">Nội dung đơn</label>
                <div
                  className="border rounded px-2 py-1 min-h-[150px] bg-muted text-black"
                  dangerouslySetInnerHTML={{ __html: detailData.description }}
                  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {detailData.status === "PENDING" && (
                <>
                  <Button
                    onClick={() => handleAccept(detailData.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    onClick={() => handleReject(detailData.id)}
                    variant="destructive"
                  >
                    Từ chối
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setShowDetail(false)}>
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
