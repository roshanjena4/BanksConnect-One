import { Suspense } from "react"
import AdminLayout from "@/components/admin-layout"
import AdminDashboard from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminDashboard />
      </Suspense>
    </AdminLayout>
  )
}
