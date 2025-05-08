import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";
import { Clock, LogIn, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { format, isWeekend } from "date-fns";
import {
  getAllAttendance,
  checkIn,
  checkOut,
  getCurrentAttendance,
} from "@/slice/attendanceSlice";

export default function UserAttendance() {
  const dispatch = useDispatch();
  const attendanceByUser = useSelector(
    (state: any) => state.attendance.attendanceByUser || []
  );

  const [attendanceStatus, setAttendanceStatus] = useState<
    "not_checked_in" | "checked_in" | "checked_out"
  >("not_checked_in");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [workingHours, setWorkingHours] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);

  const [currentTime, setCurrentTime] = useState<string>(
    format(new Date(), "HH:mm:ss")
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Gọi API để lấy trạng thái chấm công hiện tại
    dispatch(getCurrentAttendance());
  }, [dispatch]);

  useEffect(() => {
    // Kiểm tra trạng thái check-in và check-out hôm nay từ attendanceByUser
    const today = new Date().toISOString().split("T")[0];
    const todayRecord = attendanceByUser.find(
      (record: any) => record.date === today
    );
    if (todayRecord) {
      setCheckInTime(todayRecord.checkIn);
      setCheckOutTime(todayRecord.checkOut);
      setWorkingHours(todayRecord.workHours || null);

      if (todayRecord.checkIn && !todayRecord.checkOut) {
        setAttendanceStatus("checked_in");
      } else if (todayRecord.checkIn && todayRecord.checkOut) {
        setAttendanceStatus("checked_out");
      } else {
        setAttendanceStatus("not_checked_in");
      }
    }
  }, [attendanceByUser]);

  const handleCheckIn = async () => {
    const employeeId = localStorage.getItem("userId");
    if (!employeeId) return;
    try {
      setIsLoading(true);
      const data = {
        employeeId,
        date: new Date().toISOString().split("T")[0],
      };
      console.log("Check-in data:", data);
      const resultAction: any = await dispatch(checkIn(data));
      if (checkIn.fulfilled.match(resultAction)) {
        setCheckInTime(resultAction.payload.checkIn.split(".")[0]);
        setAttendanceStatus("checked_in");
      }
    } catch (error) {
      console.error("Check-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    const employeeId = localStorage.getItem("userId");
    if (!employeeId) return;
    try {
      setIsLoading(true);
      const data = {
        employeeId,
        date: new Date().toISOString().split("T")[0],
      };
      console.log("Check-out data:", data);
      const resultAction: any = await dispatch(checkOut(data));
      if (checkOut.fulfilled.match(resultAction)) {
        setCheckOutTime(resultAction.payload.checkOut.split(".")[0]);
        setWorkingHours(resultAction.payload.workHours);
        setAttendanceStatus("checked_out");
      }
    } catch (error) {
      console.error("Check-out failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAttendanceStatus = () => {
    const today = new Date();
    if (isWeekend(today)) {
      return (
        <div className="flex items-center gap-2 text-orange-600">
          <AlertCircle className="h-5 w-5" />
          <span>Hôm nay là ngày nghỉ</span>
        </div>
      );
    }
    switch (attendanceStatus) {
      case "not_checked_in":
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <span>Chưa check-in</span>
          </div>
        );
      case "checked_in":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Clock className="h-5 w-5" />
            <span>Đã check-in lúc {checkInTime?.split(".")[0]}</span>
          </div>
        );
      case "checked_out":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>
              Đã check-out lúc {checkOutTime?.split(".")[0]} (Làm việc{" "}
              {workingHours} giờ)
            </span>
          </div>
        );
    }
  };

  const paginatedRecords = Array.isArray(attendanceByUser)
    ? attendanceByUser.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Chấm công của tôi</h1>

      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>Trạng thái chấm công hôm nay</CardTitle>
          <CardDescription>
            {format(new Date(), "EEEE, dd/MM/yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              {renderAttendanceStatus()}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="text-xl font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
                  {currentTime}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCheckIn}
                    disabled={
                      attendanceStatus !== "not_checked_in" ||
                      isLoading ||
                      isWeekend(new Date())
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Check-in
                  </Button>
                  <Button
                    onClick={handleCheckOut}
                    disabled={
                      attendanceStatus !== "checked_in" ||
                      isLoading ||
                      isWeekend(new Date())
                    }
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Check-out
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm text-gray-700">
                    Giờ làm hôm nay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {workingHours ? `${workingHours} giờ` : "0 giờ"}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm text-gray-700">
                    Giờ check-in
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {checkInTime?.split(".")[0] || "--:--"}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm text-gray-700">
                    Giờ check-out
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {checkOutTime?.split(".")[0] || "--:--"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>Lịch sử chấm công</CardTitle>
          <CardDescription>Xem lịch sử chấm công của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Giờ làm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record: any) => (
                  <TableRow key={record.id} className="border-gray-200">
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      {record.checkIn?.split(".")[0] || "-"}
                    </TableCell>
                    <TableCell>
                      {record.checkOut?.split(".")[0] || "-"}
                    </TableCell>
                    <TableCell>
                      {record.workHours ? `${record.workHours} giờ` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "PRESENT"
                            ? "default"
                            : record.status === "LATE"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {record.status === "PRESENT" && "Đúng giờ"}
                        {record.status === "LATE" && "Đi muộn"}
                        {record.status === "EARLY_LEAVE" && "Về sớm"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            totalItems={attendanceByUser.length || 0}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
