import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { getRecordById } from "@/lib/data";
import DashboardHeader from "@/components/dashboard-header";
import RecordForm from "@/components/record-form";
import { checkAccess } from "@/lib/permit";

export const metadata: Metadata = {
  title: "Edit Record | MedRecord",
  description: "Edit medical record details",
};

export default async function EditRecordPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const record = await getRecordById(id);

  if (!record) {
    redirect("/dashboard");
  }

  // Check if user has access to edit this record
  const hasAccess = await checkAccess({
    user: session.user,
    resource: "medical_record",
    action: "update",
    resourceId: record.id,
    resourceAttributes: {
      patient_name: record.patient_name,
      doctor_name: record.doctor_name,
    },
  });

  if (!hasAccess) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={session.user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Record
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Update the medical record information.
          </p>
        </div>

        <RecordForm record={record} />
      </main>
    </div>
  );
}
