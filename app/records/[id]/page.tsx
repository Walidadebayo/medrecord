import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { getRecordById } from "@/lib/data"
import DashboardHeader from "@/components/dashboard-header"
import RecordDetail from "@/components/record-detail"
import { checkAccess } from "@/lib/permit"

export const metadata: Metadata = {
  title: "Record Details | MedRecord",
  description: "View medical record details",
}

export default async function RecordDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  const { id } = await params
  if (!session) {
    redirect("/login")
  }

  const record = await getRecordById(id)

  if (!record) {
    redirect("/dashboard")
  }

  // Check if user has access to this record
  const hasAccess = await checkAccess({
    user: session.user,
    resource: "medical_record",
    action: "read",
    resourceId: record.id,
    resourceAttributes: {
      patient_name: record.patient_name,
      doctor_name: record.doctor_name,
    },
  })

  if (!hasAccess) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={session.user} />
      <main className="container mx-auto px-4 py-8">
        <RecordDetail record={record} userRole={session.user.role} />
      </main>
    </div>
  )
}
