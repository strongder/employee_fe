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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Plus, Search } from "lucide-react";
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
import {
  getAllBonus,
  createBonus,
  updateBonus,
  deleteBonus,
} from "@/slice/bonusSlice";
import { URL_IMAGE } from "../../../api";
export default function Bonuses() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<any>({
    employeeCode: "",
    bonusAmount: "",
    reason: "",
    bonusDate: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBonus, setEditingBonus] = useState<any>(null);
  const { bonusAll, loading, error } = useSelector((state: any) => state.bonus);
  const [searchRequest, setSearchRequest] = useState({
    keyword: "",
    page: 1,
    size: 10,
  });

  useEffect(() => {
    dispatch(getAllBonus());
  }, [dispatch]);

  // Lọc và tìm kiếm dữ liệu thưởng
  const filteredBonuses = bonusAll.filter((bonus: any) =>
    bonus?.employee?.fullName
      .toLowerCase()
      .includes(searchRequest.keyword.toLowerCase())
  );

  // Phân trang dữ liệu
  const paginatedBonuses = filteredBonuses.slice(
    (searchRequest.page - 1) * searchRequest.size,
    searchRequest.page * searchRequest.size
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingBonus(null);
    setFormData({
      employeeCode: "",
      bonusAmount: "",
      reason: "",
      bonusDate: "",
    });
    setShowAddModal(true);
  };

  const openEditModal = (bonus: any) => {
    setEditingBonus(bonus);
    setFormData({
      employeeName: bonus?.employee?.fullName,
      employeeCode: bonus?.employee?.code,
      bonusAmount: bonus.bonusAmount,
      reason: bonus.reason,
      bonusDate: bonus.bonusDate,
    });
    setShowEditModal(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createBonus(formData)).then(() => {
      setShowAddModal(false);
    });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBonus) return;
    console.log("Editing bonus:", editingBonus);
    dispatch(updateBonus({ id: editingBonus.id, updatedData: formData })).then(
      () => {
        setShowEditModal(false);
      }
    );
  };

  const handleDelete = (id: number) => {
    dispatch(deleteBonus(id));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý thưởng</h1>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm thưởng
        </Button>
      </div>

      {loading && <div className="text-blue-600">Đang tải dữ liệu...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách thưởng</CardTitle>
          <CardDescription>
            Quản lý thông tin thưởng của nhân viên
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
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Ngày thưởng</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBonuses.map((bonus: any) => (
                    <TableRow key={bonus.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={
                                bonus?.employee?.avatar
                                  ? URL_IMAGE + bonus?.employee?.avatar
                                  : `https://ui-avatars.com/api/?name=${bonus?.employee?.fullName?.charAt(
                                      0
                                    )}&background=random`
                              }
                              alt={bonus?.employee?.fullName}
                            />
                            <AvatarFallback>
                              {bonus?.employee?.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {bonus?.employee?.fullName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {bonus?.employee?.code}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {bonus?.bonusAmount.toLocaleString()} VND
                      </TableCell>

                      <TableCell>
                        <span className="truncate max-w-[200px] block">
                          {bonus?.reason}
                        </span>
                      </TableCell>
                      <TableCell>{bonus?.bonusDate}</TableCell>
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
                              onClick={() => openEditModal(bonus)}
                            >
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(bonus.id)}
                            >
                              Xóa thưởng
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
              totalItems={filteredBonuses.length}
              itemsPerPage={searchRequest.size}
              currentPage={searchRequest.page}
              onPageChange={(page) =>
                setSearchRequest({ ...searchRequest, page })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal thêm thưởng */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm thưởng mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="flex flex-col gap-2">
            <Label>Mã nhân viên</Label>
            <Input
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              required
            />

            <Label>Số tiền</Label>
            <Input
              name="bonusAmount"
              type="number"
              value={formData.bonusAmount}
              onChange={handleChange}
              required
            />
            <Label>Mô tả</Label>
            <Input
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            />
            <Label>Ngày thưởng</Label>
            <Input
              name="bonusDate"
              type="date"
              value={formData.bonusDate}
              onChange={handleChange}
              required
            />
            <DialogFooter>
              <Button type="submit">Lưu</Button>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Hủy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* them dialog chinh sua */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thưởng</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="flex flex-col gap-2">
            <Label>Mã nhân viên</Label>
            <Input
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              required
            />
            <Label>Số tiền</Label>
            <Input
              name="bonusAmount"
              type="number"
              value={formData.bonusAmount}
              onChange={handleChange}
              required
            />
            <Label>Mô tả</Label>
            <Input
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            />
            <Label>Ngày thưởng</Label>
            <Input
              name="bonusDate"
              type="date"
              value={formData.bonusDate}
              onChange={handleChange}
              required
            />
            <DialogFooter>
              <Button type="submit">Lưu</Button>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Hủy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
