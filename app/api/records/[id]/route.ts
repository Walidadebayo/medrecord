import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { getRecordById, updateRecord, deleteRecord } from "@/lib/data"
import { checkAccess } from "@/lib/permit"

export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
  const { id } = await params
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const record = await getRecordById(id)

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
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
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    return NextResponse.json({ record })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch record" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, {params}: { params: { id: string } }) {
  const { id } = await params
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const record = await getRecordById(id)

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    // Check if user has access to update this record
    const hasAccess = await checkAccess({
      user: session.user,
      resource: "medical_record",
      action: "update",
      resourceId: record.id,
      resourceAttributes: {
        patient_name: record.patient_name,
        doctor_name: record.doctor_name,
      },
    })

    if (!hasAccess) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const body = await request.json()
    const updatedRecord = await updateRecord(id, body)

    return NextResponse.json({ record: updatedRecord })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 })
  }
}

export async function DELETE({params}: { params: { id: string } }) {
  const { id } = await params
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const record = await getRecordById(id)

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    // Check if user has access to delete this record
    const hasAccess = await checkAccess({
      user: session.user,
      resource: "medical_record",
      action: "delete",
      resourceId: record.id,
      resourceAttributes: {
        patient_name: record.patient_name,
        doctor_name: record.doctor_name,
      },
    })

    if (!hasAccess) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    await deleteRecord(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 })
  }
}
