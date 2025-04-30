"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Edit, Trash2, MoreHorizontal, Search, Filter, Calendar, X, FileText } from "lucide-react"
import type { MedicalRecord, SearchFilters } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { usePermit } from "@/lib/permit-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface RecordsTableProps {
  records: MedicalRecord[]
  userRole: string
}

export default function RecordsTable({ records: initialRecords, userRole }: RecordsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()
  const { checkPermission } = usePermit()

  // Fetch records with search and filters
  const fetchRecords = async () => {
    setIsLoading(true)
    try {
      // Build query params
      const params = new URLSearchParams()

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      if (filters.dateRange?.start) {
        params.append("startDate", filters.dateRange.start)
      }

      if (filters.dateRange?.end) {
        params.append("endDate", filters.dateRange.end)
      }

      if (filters.doctorName) {
        params.append("doctor", filters.doctorName)
      }

      if (filters.patientName) {
        params.append("patient", filters.patientName)
      }

      const response = await fetch(`/api/records?${params.toString()}`)

      if (response.ok) {
        const data = await response.json()
        setRecords(data.records)
      }
    } catch (error) {
      console.error("Error fetching records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch records when search or filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchRecords()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, filters])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const response = await fetch(`/api/records/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          // Update local state
          setRecords(records.filter((record) => record.id !== id))
          router.refresh()
        } else {
          console.error("Failed to delete record")
        }
      } catch (error) {
        console.error("Error deleting record:", error)
      }
    }
  }

  const clearFilters = () => {
    setFilters({})
  }

  const hasActiveFilters = () => {
    return !!(filters.dateRange?.start || filters.dateRange?.end || filters.doctorName || filters.patientName)
  }

  if (records.length === 0 && !hasActiveFilters() && !searchTerm) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              No medical records found.{" "}
              {userRole === "admin" && (
                <Link href="/records/new" className="font-medium underline">
                  Create a new record
                </Link>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search records..."
            className="pl-8 bg-white dark:bg-gray-950"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-blue-50 text-blue-600 border-blue-200" : ""}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-600">
                {
                  Object.keys(filters).filter((key) =>
                    key === "dateRange"
                      ? filters.dateRange?.start || filters.dateRange?.end
                      : filters[key as keyof SearchFilters],
                  ).length
                }
              </Badge>
            )}
          </Button>

          {hasActiveFilters() && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal bg-white">
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.dateRange?.start ? (
                        format(new Date(filters.dateRange.start), "PPP")
                      ) : (
                        <span>Start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined}
                      onSelect={(date) =>
                        setFilters({
                          ...filters,
                          dateRange: {
                            ...filters.dateRange,
                            start: date ? date.toISOString() : undefined,
                          },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal bg-white">
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.dateRange?.end ? format(new Date(filters.dateRange.end), "PPP") : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined}
                      onSelect={(date) =>
                        setFilters({
                          ...filters,
                          dateRange: {
                            ...filters.dateRange,
                            end: date ? date.toISOString() : undefined,
                          },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {userRole === "admin" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Doctor</label>
                <Input
                  placeholder="Filter by doctor name"
                  value={filters.doctorName || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      doctorName: e.target.value || undefined,
                    })
                  }
                  className="bg-white"
                />
              </div>
            )}

            {userRole !== "patient" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Patient</label>
                <Input
                  placeholder="Filter by patient name"
                  value={filters.patientName || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      patientName: e.target.value || undefined,
                    })
                  }
                  className="bg-white"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="overflow-hidden border-0 shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Files</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={6} className="h-16 text-center">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No records found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.patient_name}</TableCell>
                    <TableCell>{record.doctor_name}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>{formatDate(record.created_at)}</TableCell>
                    <TableCell>
                      {record.files && record.files.length > 0 ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          <FileText className="h-3 w-3 mr-1" />
                          {record.files.length}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/records/${record.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>

                        {checkPermission("medical_record", "update", record.id) && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/records/${record.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                        )}

                        {userRole === "admin" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDelete(record.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
