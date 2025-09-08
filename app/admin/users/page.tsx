import { Suspense } from "react"
import AdminLayout from "@/components/admin-layout"
import UserManagement from "@/components/user-management"

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
        <UserManagement />
      </Suspense>
    </AdminLayout>
  )
}
