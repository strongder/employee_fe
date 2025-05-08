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
  getByEmployee,
} from "@/slice/bonusSlice";

export default function UserBonuses() {
  const dispatch = useDispatch();
  const { bonusesByEmployee, loading, error } = useSelector(
    (state: any) => state.bonus
  );
  const [searchRequest, setSearchRequest] = useState({
    keyword: "",
    page: 1,
    size: 10,
  });
  useEffect(() => {
    const employeeId = localStorage.getItem("userId");
    if (employeeId) {
      dispatch(getByEmployee(employeeId));
    }
  }, [dispatch]);

  // Lọc và tìm kiếm dữ liệu thưởng
  const filteredBonuses = bonusesByEmployee.filter((bonus: any) =>
    bonus?.employee?.fullName
      .toLowerCase()
      .includes(searchRequest.keyword.toLowerCase())
  );

  // Phân trang dữ liệu
  const paginatedBonuses = filteredBonuses.slice(
    (searchRequest.page - 1) * searchRequest.size,
    searchRequest.page * searchRequest.size
  );

  const handleDelete = (id: number) => {
    dispatch(deleteBonus(id));
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thưởng</CardTitle>
          <CardDescription>Thông tin thưởng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2 items-center">
                <div className="relative"></div>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBonuses.map((bonus: any) => (
                    <TableRow key={bonus.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://ui-avatars.com/api/?name=${bonus?.employee?.fullName.charAt(
                                0
                              )}&background=random`}
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
    </div>
  );
}
