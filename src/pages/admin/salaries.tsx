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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  searchSalary,
  createSalary,
  updateSalary,
  deleteSalary,
  getAllSalary,
  calculateSalary,
} from "@/slice/salarySlice";
import { URL_IMAGE } from "../../../api";

export default function Salaries() {
  const dispatch = useDispatch();
  const { salaryAll, loading, error } = useSelector(
    (state: any) => state.salary
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSalary, setEditingSalary] = useState<any>(null);
  const [searchRequest, setSearchRequest] = useState({
    keyword: "",
    page: 1,
    size: 3,
    month: "ALL",
    status: "ALL",
  });

  // Thêm state cho form lương
  const [formData, setFormData] = useState<any>({
    employeeCode: "",
    monthYear: "",
    baseSalary: "",
    allowanceAmount: "",
    bonusAmount: "",
    deductionAmount: "",
    totalSalary: "",
    paymentDate: "",
    status: "PENDING",
  });

  useEffect(() => {
    dispatch(getAllSalary());
  }, [dispatch]);

  // Filter, search, paginate phía frontend
  const filteredSalaries = React.useMemo(() => {
    let data = salaryAll || [];
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
  }, [salaryAll, searchRequest]);

  // Phân trang phía frontend
  const paginatedSalaries = React.useMemo(() => {
    const start = (searchRequest.page - 1) * searchRequest.size;
    return filteredSalaries.slice(start, start + searchRequest.size);
  }, [filteredSalaries, searchRequest.page, searchRequest.size]);

  // Xử lý thay đổi form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Mở modal thêm
  const openAddModal = () => {
    setEditingSalary(null);
    setFormData({
      employeeCode: "",
      monthYear: "",
      baseSalary: "",
      allowanceAmount: "",
      bonusAmount: "",
      deductionAmount: "",
      totalSalary: "",
      paymentDate: "",
      status: "PENDING",
    });
    setShowAddModal(true);
  };

  useEffect(() => {
    const total =
      Number(formData.baseSalary || 0) +
      Number(formData.allowanceAmount || 0) +
      Number(formData.bonusAmount || 0) -
      Number(formData.deductionAmount || 0);

    setFormData((prev: any) => ({
      ...prev,
      totalSalary: total,
    }));
  }, [
    formData.baseSalary,
    formData.allowanceAmount,
    formData.bonusAmount,
    formData.deductionAmount,
  ]);

  // Mở modal sửa
  const openEditModal = (salary: any) => {
    setEditingSalary(salary);
    setFormData({
      employeeCode: salary.employee?.code || "",
      monthYear: salary.monthYear,
      baseSalary: salary.baseSalary,
      allowanceAmount: salary.allowanceAmount,
      bonusAmount: salary.bonusAmount,
      deductionAmount: salary.deductionAmount,
      totalSalary: salary.totalSalary,
      paymentDate: salary.paymentDate || "",
      status: salary.status,
    });
    setShowEditModal(true);
  };

  // Submit thêm lương
  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createSalary(formData)).then(() => {
      setShowAddModal(false);
      dispatch(getAllSalary());
    });
  };

  // Submit sửa lương
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSalary) return;
    dispatch(
      updateSalary({
        id: editingSalary.id,
        updatedData: formData,
      })
    ).then(() => {
      setShowEditModal(false);
    });
  };
  const handleSubmitPayment = (salary: any) => {
    const updatedData = {
      employeeCode: salary.employee?.code || "",
      monthYear: salary.monthYear,
      baseSalary: salary.baseSalary,
      allowanceAmount: salary.allowanceAmount,
      bonusAmount: salary.bonusAmount,
      deductionAmount: salary.deductionAmount,
      totalSalary: salary.totalSalary,
      paymentDate: salary.paymentDate || "",
      status: "PAID",
    };
    dispatch(
      updateSalary({
        id: salary.id,
        updatedData,
      })
    );
  };
  const handleMonthYearBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const monthYear = e.target.value;
    const employeeCode = formData.employeeCode.trim();

    if (employeeCode && monthYear) {
      const param = {
        employeeCode,
        monthYear, // YYYY-MM
      };

      console.log("param", param);

      dispatch(calculateSalary({ param }))
        .unwrap()
        .then((res: any) => {
          if (res) {
            setFormData((prev: any) => ({
              ...prev,
              baseSalary: res.salary,
              bonusAmount: res.totalBonus,
            }));
          }
        });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý lương</h1>
        <Button onClick={openAddModal}>+ Thêm lương</Button>
      </div>
      {loading && <div className="text-blue-600">Đang tải dữ liệu...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lương</CardTitle>
          <CardDescription>
            Quản lý thông tin lương của nhân viên
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
                        page: 1,
                      })
                    }
                  />
                </div>
              </div>
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
                    <TableHead>Mã nhân viên</TableHead>
                    <TableHead>Lương cơ bản</TableHead>
                    <TableHead>Thưởng</TableHead>
                    <TableHead>Phụ cấp</TableHead>
                    <TableHead>Khấu trừ</TableHead>
                    <TableHead>Thực lãnh</TableHead>
                    <TableHead>Ngày thanh toán</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
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
                                src={
                                  salary?.employee?.avatar
                                    ? URL_IMAGE + salary?.employee?.avatar
                                    : `https://ui-avatars.com/api/?name=${salary?.employee?.fullName?.charAt(
                                        0
                                      )}&background=random`
                                }
                                alt={salary?.employee?.fullName}
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
                                {salary.employee?.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{salary?.employee?.code}</TableCell>
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
                                onClick={() => openEditModal(salary)}
                              >
                                Chỉnh sửa
                              </DropdownMenuItem>
                              {salary.status === "PENDING" && (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => handleSubmitPayment(salary)}
                                >
                                  Đánh dấu đã thanh toán
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm lương mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="flex flex-col gap-2">
            <Label>Mã nhân viên</Label>
            <Input
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              required
            />
            <Label>Tháng</Label>
            <Input
              name="monthYear"
              type="month"
              value={formData.monthYear}
              onChange={handleChange}
              required
              onBlur={handleMonthYearBlur}
            />
            <Label>Lương cơ bản</Label>
            <Input
              name="baseSalary"
              type="number"
              value={formData.baseSalary}
              onChange={handleChange}
              required
            />
            <Label>Phụ cấp</Label>
            <Input
              name="allowanceAmount"
              type="number"
              value={formData.allowanceAmount}
              onChange={handleChange}
            />
            <Label>Thưởng</Label>
            <Input
              name="bonusAmount"
              type="number"
              value={formData.bonusAmount}
              onChange={handleChange}
            />
            <Label>Khấu trừ</Label>
            <Input
              name="deductionAmount"
              type="number"
              value={formData.deductionAmount}
              onChange={handleChange}
            />
            <Label>Tổng lương</Label>
            <Input
              name="totalSalary"
              type="number"
              value={formData.totalSalary}
              onChange={handleChange}
              required
            />
            <Label>Ngày thanh toán</Label>
            <Input
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={handleChange}
              required
            />
            <Label>Trạng thái</Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            >
              <option value="PENDING">Chưa thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Lưu
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa lương</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="flex flex-col gap-2">
            <Label>Mã nhân viên</Label>
            <Input
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              required
            />
            {/* them luong thang bao nhieu */}
            <Label>Tháng</Label>
            <Input
              name="monthYear"
              type="month"
              value={formData.monthYear}
              onChange={handleChange}
              required
            />
            <Label>Lương cơ bản</Label>
            <Input
              name="baseSalary"
              type="number"
              value={formData.baseSalary}
              onChange={handleChange}
              required
            />
            <Label>Phụ cấp</Label>
            <Input
              name="allowanceAmount"
              type="number"
              value={formData.allowanceAmount}
              onChange={handleChange}
            />
            <Label>Thưởng</Label>
            <Input
              name="bonusAmount"
              type="number"
              value={formData.bonusAmount}
              onChange={handleChange}
            />
            <Label>Khấu trừ</Label>
            <Input
              name="deductionAmount"
              type="number"
              value={formData.deductionAmount}
              onChange={handleChange}
            />
            <Label>Tổng lương</Label>
            <Input
              name="totalSalary"
              type="number"
              value={formData.totalSalary}
              onChange={handleChange}
              required
            />
            <Label>Ngày thanh toán</Label>
            <Input
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={handleChange}
              required
            />
            <Label>Trạng thái</Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            >
              <option value="PENDING">Chưa thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Lưu
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Hủy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
