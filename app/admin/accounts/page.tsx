import { Suspense } from "react"
import AdminLayout from "@/components/admin-layout"
import AccountManagement from "@/components/account-management"

export default function AdminAccountsPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <AccountManagement />
      </Suspense>
    </AdminLayout>
  )
}
