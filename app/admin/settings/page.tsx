import { Suspense } from "react"
import AdminLayout from "@/components/admin-layout"
import AdminSettings from "@/components/admin-settings"

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminSettings />
      </Suspense>
    </AdminLayout>
  )
}
