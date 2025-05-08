import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for charts
const employeesByDepartment = [
  { name: "Kỹ thuật", count: 25 },
  { name: "Marketing", count: 12 },
  { name: "Nhân sự", count: 8 },
  { name: "Kinh doanh", count: 18 },
  { name: "Tài chính", count: 6 },
  { name: "Hành chính", count: 4 },
]

const employeesByMonth = [
  { name: "T1", count: 60 },
  { name: "T2", count: 65 },
  { name: "T3", count: 68 },
  { name: "T4", count: 73 },
  { name: "T5", count: 78 },
  { name: "T6", count: 82 },
  { name: "T7", count: 85 },
  { name: "T8", count: 89 },
  { name: "T9", count: 91 },
  { name: "T10", count: 95 },
  { name: "T11", count: 98 },
  { name: "T12", count: 102 },
]

const workHoursByMonth = [
  { name: "T1", hours: 10560 },
  { name: "T2", hours: 11200 },
  { name: "T3", hours: 11520 },
  { name: "T4", hours: 12480 },
  { name: "T5", hours: 13440 },
  { name: "T6", hours: 14080 },
  { name: "T7", hours: 14720 },
  { name: "T8", hours: 15360 },
  { name: "T9", hours: 15680 },
  { name: "T10", hours: 16320 },
  { name: "T11", hours: 16960 },
  { name: "T12", hours: 17600 },
]

const leaveRequestsByType = [
  { name: "Nghỉ phép năm", value: 120 },
  { name: "Nghỉ ốm", value: 45 },
  { name: "Nghỉ không lương", value: 25 },
  { name: "Nghỉ đặc biệt", value: 10 },
]

const leaveRequestsByMonth = [
  { name: "T1", count: 12 },
  { name: "T2", count: 15 },
  { name: "T3", count: 18 },
  { name: "T4", count: 10 },
  { name: "T5", count: 14 },
  { name: "T6", count: 20 },
  { name: "T7", count: 25 },
  { name: "T8", count: 30 },
  { name: "T9", count: 22 },
  { name: "T10", count: 16 },
  { name: "T11", count: 12 },
  { name: "T12", count: 8 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function Reports() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Báo cáo thống kê</h1>
        <Select defaultValue="2025">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">Năm 2025</SelectItem>
            <SelectItem value="2024">Năm 2024</SelectItem>
            <SelectItem value="2023">Năm 2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees">Nhân viên</TabsTrigger>
          <TabsTrigger value="workHours">Giờ làm việc</TabsTrigger>
          <TabsTrigger value="leaveRequests">Nghỉ phép</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Số lượng nhân viên theo phòng ban</CardTitle>
                <CardDescription>Phân bố nhân viên trong các phòng ban</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={employeesByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Số nhân viên" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tăng trưởng nhân sự theo tháng</CardTitle>
                <CardDescription>Số lượng nhân viên qua các tháng</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={employeesByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Số nhân viên" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workHours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tổng giờ làm việc theo tháng</CardTitle>
              <CardDescription>Tổng số giờ làm việc của toàn bộ nhân viên</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={workHoursByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" fill="#82ca9d" name="Giờ làm việc" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaveRequests" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Đơn xin nghỉ theo loại</CardTitle>
                <CardDescription>Phân loại các đơn xin nghỉ phép</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={leaveRequestsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leaveRequestsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Đơn xin nghỉ theo tháng</CardTitle>
                <CardDescription>Số lượng đơn xin nghỉ qua các tháng</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={leaveRequestsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#ffc658" name="Số đơn xin nghỉ" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
