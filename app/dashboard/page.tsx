import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import RecordsTable from "@/components/records-table"
import { getRecordsByRole } from "@/lib/data"

export const metadata: Metadata = {
  title: "Dashboard | MedRecord",
  description: "Medical Records Dashboard",
}

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  const records = await getRecordsByRole(session.user)

  return (
    <div className="min-h-screen">
      <DashboardHeader user={session.user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Records</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage and view patient records based on your access level.
          </p>
        </div>

        <RecordsTable records={records} userRole={session.user.role} />
      </main>
    </div>
  )
}
