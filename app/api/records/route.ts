import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { createRecord, searchRecords } from "@/lib/data"
import { checkAccess } from "@/lib/permit"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined
    const doctorName = searchParams.get("doctor") || undefined
    const patientName = searchParams.get("patient") || undefined

    // Use advanced search with filters
    const records = await searchRecords(searchTerm, {
      role: session.user.role,
      userName: session.user.name,
      dateRange: startDate || endDate ? { start: startDate, end: endDate } : undefined,
      doctorName,
      patientName,
    })

    return NextResponse.json({ records })
  } catch (error) {
    console.error("Failed to fetch records:", error)
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has access to create records
    const hasAccess = await checkAccess({
      user: session.user,
      resource: "medical_record",
      action: "create",
    })

    if (!hasAccess) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const body = await request.json()
    const newRecord = await createRecord(body)

    return NextResponse.json({ record: newRecord })
  } catch (error) {
    console.error("Failed to create record:", error)
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 })
  }
}
