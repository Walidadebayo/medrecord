import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import RecordForm from "@/components/record-form"
import { checkAccess } from "@/lib/permit"

export const metadata: Metadata = {
  title: "New Record | MedRecord",
  description: "Create a new medical record",
}

export default async function NewRecordPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user has access to create records
  const hasAccess = await checkAccess({
    user: session.user,
    resource: "medical_record",
    action: "create",
  })

  if (!hasAccess) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={session.user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Record</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Add a new medical record to the system.</p>
        </div>

        <RecordForm />
      </main>
    </div>
  )
}
