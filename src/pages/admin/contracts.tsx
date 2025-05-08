import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createContract, updateContract, deleteContract, getAllContract } from "@/slice/contractSlice"
import React from "react"
import api from "../../../api";

export default function Contracts() {
  const [open, setOpen] = useState(false)
  const [searchRequest, setSearchRequest] = useState({
    keyword: "",
    page: 1,
    size: 10,
    contractType: "ALL",
    status: "ALL",
  });
  const [form, setForm] = useState<{
    id?: number;
    contractCode?: string;
    employeeCode: string;
    startDate: string;
    endDate: string;
    contractType: string;
    contractStatus: string;
    contractFile?: File;
    monthlySalary: string;
  }>({
    id: undefined,
    contractCode: '',
    employeeCode: '',
    startDate: '',
    endDate: '',
    contractType: 'FULL_TIME',
    contractStatus: 'ACTIVE',
    contractFile: undefined,
    monthlySalary: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);

  const dispatch: any = useDispatch();
  const {contractAll} = useSelector((state:any)=> state.contract)

  // Dummy contracts để tránh lỗi render
  useEffect(()=>{
    dispatch(getAllContract())
  }, [dispatch, searchRequest])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, contractFile: e.target.files[0] });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Hàm chuyển đổi ngày yyyy-MM-dd -> dd/MM/yyyy
  function toDDMMYYYY(dateStr: string) {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}/${mm}/${yyyy}`;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý gửi dữ liệu hợp đồng và file lên server tại đây
    setOpen(false)
    setForm({
      id: undefined,
      contractCode: '',
      employeeCode: '',
      startDate: '',
      endDate: '',
      contractType: 'FULL_TIME',
      contractStatus: 'ACTIVE',
      contractFile: undefined,
      monthlySalary: '',
    })
  }

  // Filter, search, paginate phía frontend
  const filteredContracts = React.useMemo(() => {
    let data = contractAll || [];
    if (searchRequest.keyword) {
      data = data.filter(
        (item: any) =>
          item.employeeName?.toLowerCase().includes(searchRequest.keyword.toLowerCase()) ||
          item.employeeCode?.toLowerCase().includes(searchRequest.keyword.toLowerCase())
      );
    }
    if (searchRequest.contractType !== "ALL") {
      data = data.filter((item: any) => item.contractType === searchRequest.contractType);
    }
    if (searchRequest.status !== "ALL") {
      data = data.filter((item: any) => item.status === searchRequest.status);
    }
    return data;
  }, [contractAll, searchRequest]);

  const paginatedContracts = React.useMemo(() => {
    const start = (searchRequest.page - 1) * searchRequest.size;
    return filteredContracts.slice(start, start + searchRequest.size);
  }, [filteredContracts, searchRequest.page, searchRequest.size]);

  // Mở modal thêm
  const openAddModal = () => {
    setEditingContract(null);
    setForm({
      id: undefined,
      contractCode: '',
      employeeCode: '',
      startDate: '',
      endDate: '',
      contractType: 'FULL_TIME',
      contractStatus: 'ACTIVE',
      contractFile: undefined,
      monthlySalary: '',
    });
    setShowAddModal(true);
  };

  // Mở modal sửa
  const openEditModal = (contract: any) => {
    setEditingContract(contract);
    setForm({
      id: contract.id,
      contractCode: contract.contractCode,
      employeeCode: contract?.employee?.code,
      startDate: contract.startDate,
      endDate: contract.endDate,
      contractType: contract.contractType,
      contractStatus: contract.contractStatus,
      contractFile: undefined,
      monthlySalary: contract.monthlySalary,
    });
    setShowEditModal(true);
  };

  // Submit thêm hợp đồng
  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      startDate: toDDMMYYYY(form.startDate),
      endDate: toDDMMYYYY(form.endDate),
    };
    dispatch(createContract(payload)).then(() => {
      setShowAddModal(false);
    });
  };

  // Submit sửa hợp đồng
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContract) return;
    const payload: any = {
      ...form,
      startDate: toDDMMYYYY(form.startDate),
      endDate: toDDMMYYYY(form.endDate),
    };
    if (!form.contractFile) {
      delete payload.contractFile;
    }
    dispatch(updateContract({
      id: editingContract.id,
      updatedData: payload,
    })).then(() => {
      setShowEditModal(false);
    });
  };

  // Xóa hợp đồng
  const handleDeleteContract = (id: number) => {
    // dispatch(deleteContract(id));
  };
  const handleDownload = async (contract: any) => {
    try {
      // Gọi API để lấy file dưới dạng blob
      const response = await api.get(`/files/download/${contract.contractUrl}`, {
        responseType: 'blob', // Quan trọng để nhận file nhị phân
      });

      // Lấy tên file từ header (nếu backend trả về)
      let fileName = contract.contractUrl;
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('filename*=UTF-8\'\'') !== -1) {
        fileName = decodeURIComponent(disposition.split("filename*=UTF-8''")[1]);
      }

      // Tạo URL tạm cho file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Đặt tên file khi tải về
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Tải file thất bại!');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý hợp đồng</h1>
        <Button onClick={openAddModal}>+ Thêm hợp đồng</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hợp đồng</CardTitle>
          <CardDescription>Quản lý thông tin hợp đồng của nhân viên</CardDescription>
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
                    onChange={e => setSearchRequest({ ...searchRequest, keyword: e.target.value, page: 1 })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={searchRequest.contractType}
                  onValueChange={value => setSearchRequest({ ...searchRequest, contractType: value, page: 1 })}
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
                  onValueChange={value => setSearchRequest({ ...searchRequest, status: value, page: 1 })}
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
                  {paginatedContracts && paginatedContracts.map((contract: any) => (
                    <TableRow key={contract.id}>
                      <TableCell>{contract.contractCode}</TableCell>
                      <TableCell>{contract?.employee?.code}</TableCell>
                      <TableCell>{contract.contractType}</TableCell>
                      <TableCell>{contract.startDate}</TableCell>
                      <TableCell>{contract.endDate}</TableCell>
                      <TableCell>{contract.monthlySalary?.toLocaleString()} VND</TableCell>
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
                          {contract.contractStatus === "ACTIVE" && "Đang hiệu lực"}
                          {contract.contractStatus === "INACTIVE" && "Hết hạn"}
                          {contract.contractStatus === "TERMINATED" && "Đã chấm dứt"}
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
                            <DropdownMenuItem onClick={() => openEditModal(contract)}>
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteContract(contract.id)}>
                              Xóa hợp đồng
                            </DropdownMenuItem>
                            <DropdownMenuItem  onClick={() => handleDownload(contract)}>
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
              onPageChange={page => setSearchRequest({ ...searchRequest, page })}
            />
          </div>
        </CardContent>
      </Card>
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm hợp đồng mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="flex flex-col gap-2">
            <label className="font-medium">Mã nhân viên</label>
            <Input name="employeeCode" value={form.employeeCode} onChange={handleChange} required />
            <label className="font-medium">Loại hợp đồng</label>
            <select name="contractType" value={form.contractType} onChange={handleChange} className="border rounded px-2 py-1" required>
              <option value="FULL_TIME">Toàn thời gian</option>
              <option value="PART_TIME">Bán thời gian</option>
              <option value="INTERNSHIP">Thực tập</option>
            </select>
            <label className="font-medium">Trạng thái</label>
            <select name="contractStatus" value={form.contractStatus} onChange={handleChange} className="border rounded px-2 py-1" required>
              <option value="ACTIVE">Đang hiệu lực</option>
              <option value="INACTIVE">Hết hạn</option>
              <option value="TERMINATED">Đã chấm dứt</option>
            </select>
            <label className="font-medium">Ngày bắt đầu</label>
            <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
            <label className="font-medium">Ngày kết thúc</label>
            <Input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
            <label className="font-medium">Lương cơ bản (VND)</label>
            <Input type="number" name="monthlySalary" value={form.monthlySalary} onChange={handleChange} required min={0} />
            <label className="font-medium">Tải file hợp đồng</label>
            <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
            <DialogFooter>
              <Button type="submit">Lưu</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Hủy</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hợp đồng</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="flex flex-col gap-2">
            <label className="font-medium">Mã hợp đồng</label>
            <Input name="contractCode" value={form.contractCode} disabled />
            <label className="font-medium">Mã nhân viên</label>
            <Input name="employeeCode" value={form.employeeCode} onChange={handleChange} required />
            <label className="font-medium">Loại hợp đồng</label>
            <select name="contractType" value={form.contractType} onChange={handleChange} className="border rounded px-2 py-1" required>
              <option value="FULL_TIME">Toàn thời gian</option>
              <option value="PART_TIME">Bán thời gian</option>
              <option value="INTERNSHIP">Thực tập</option>
            </select>
            <label className="font-medium">Trạng thái</label>
            <select name="contractStatus" value={form.contractStatus} onChange={handleChange} className="border rounded px-2 py-1" required>
              <option value="ACTIVE">Đang hiệu lực</option>
              <option value="INACTIVE">Hết hạn</option>
              <option value="TERMINATED">Đã chấm dứt</option>
            </select>
            <label className="font-medium">Ngày bắt đầu</label>
            <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
            <label className="font-medium">Ngày kết thúc</label>
            <Input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
            <label className="font-medium">Lương cơ bản (VND)</label>
            <Input type="number" name="monthlySalary" value={form.monthlySalary} onChange={handleChange} required min={0} />
            <label className="font-medium">Tải file hợp đồng</label>
            <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            <DialogFooter>
              <Button type="submit">Lưu</Button>
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Hủy</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
