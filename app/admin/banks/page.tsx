import { Suspense } from "react"
import AdminLayout from "@/components/admin-layout"
import BankManagement from "@/components/bank-management"

export default function AdminBanksPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <BankManagement />
      </Suspense>
    </AdminLayout>
  )
}
