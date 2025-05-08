import { Outlet } from "react-router-dom"
import { UserSidebar } from "../components/user-sidebar"
import { Topbar } from "../components/topbar"

export default function UserLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <UserSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
