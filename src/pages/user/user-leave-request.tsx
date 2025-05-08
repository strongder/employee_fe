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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS của react-quill
import { useSelector, useDispatch } from "react-redux";
import { createLeaveRequest, getByEmployee } from "@/slice/leaveRequestSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function UserLeaveRequest() {
  const dispatch = useDispatch();
  const { leaveRequestsByEmployee } = useSelector(
    (state: any) => state.leaveRequest
  );
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: localStorage.getItem("userId"),
    leaveDate: "",
    numberOfDays: "",
    reason: "",
    description: "", // Nội dung đơn (rich text)
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const employeeId = localStorage.getItem("userId");
    if (employeeId) {
      dispatch(getByEmployee(employeeId));
    }
  }, [dispatch]);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return leaveRequestsByEmployee.slice(start, start + itemsPerPage);
  }, [leaveRequestsByEmployee, currentPage, itemsPerPage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = () => {
    dispatch(createLeaveRequest(formData));
    setShowAddDialog(false);
    setFormData({
      employeeId: localStorage.getItem("userId"),
      leaveDate: "",
      numberOfDays: "",
      reason: "",
      description: "",
    });
  };

  const handleShowDetail = (request: any) => {
    console.log(request);
    setDetailData(request);
    setShowDetail(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Đơn xin nghỉ phép</h1>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 text-white"
        >
          Thêm đơn xin nghỉ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn xin nghỉ phép</CardTitle>
          <CardDescription>
            Quản lý các đơn xin nghỉ phép của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Từ ngày</TableHead>
                  <TableHead>Số ngày</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests &&
                  paginatedRequests.map((request: any) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.leaveDate}</TableCell>
                      <TableCell>{request.numberOfDays}</TableCell>
                      <TableCell>{request.reason}</TableCell>
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
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShowDetail(request)}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            totalItems={leaveRequestsByEmployee.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Dialog thêm đơn xin nghỉ */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl sm:max-w-[800px] max-h-[80vh] overflow-y-auto text-black">
          <DialogHeader>
            <DialogTitle>Thêm đơn xin nghỉ phép</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div>
              <label className="font-medium">Từ ngày</label>
              <Input
                type="date"
                name="leaveDate"
                value={formData.leaveDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="font-medium">Số ngày nghỉ</label>
              <Input
                type="number"
                name="numberOfDays"
                value={formData.numberOfDays}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="font-medium">Lý do</label>
              <Input
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="font-medium">Nội dung đơn</label>
              <ReactQuill
                key={showAddDialog ? "quill-open" : "quill-closed"}
                theme="snow"
                value={formData.description}
                onChange={handleDescriptionChange}
                placeholder="Nhập nội dung đơn xin nghỉ..."
                className="min-h-[150px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleSubmit} className="bg-blue-600 text-white">
              Gửi đơn
            </Button>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
