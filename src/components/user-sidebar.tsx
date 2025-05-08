import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {Calendar, ClipboardList, DollarSign, LayoutGrid, Award, FileText } from 'lucide-react'

const sidebarItems = [
  {
    title: "Chấm công",
    icon: Calendar,
    href: "/user/attendance",
  },
  {
    title: "Đơn nghỉ phép",
    icon: ClipboardList,
    href: "/user/leave-requests",
  },
  {
    title: "Lương",
    icon: DollarSign,
    href: "/user/salaries",
  },
  {
    title: "Thưởng",
    icon: Award,
    href: "/user/bonuses",
  },
  {
    title: "Hợp đồng",
    icon: FileText,
    href: "/user/contracts",
  }
]
export function UserSidebar() {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div className="hidden md:flex h-screen w-64 flex-col hr-sidebar">
      <div className="flex h-14 items-center border-b border-[#1e293b] px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-white">
          <LayoutGrid className="h-6 w-6" />
          <span>HR System</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "hr-sidebar-item",
                currentPath === item.href ? "active" : ""
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
