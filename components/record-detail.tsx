"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, ArrowLeft, FileText, ImageIcon, FileIcon, Download, Eye } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { MedicalRecord } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface RecordDetailProps {
  record: MedicalRecord
  userRole: string
}

export default function RecordDetail({ record, userRole }: RecordDetailProps) {
  // State for dialog
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingFile, setViewingFile] = useState<{name: string, url: string, contentType: string} | null>(null)

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    } else if (contentType === "application/pdf") {
      return <FileText className="h-4 w-4" />
    } else {
      return <FileIcon className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const handleViewFile = (file: {name: string, url: string, contentType: string}) => {
    setViewingFile(file)
    setIsViewDialogOpen(true)
  }

  const renderFileContent = () => {
    if (!viewingFile) return null

    if (viewingFile.contentType.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img 
            src={viewingFile.url} 
            alt={viewingFile.name} 
            className="max-h-[70vh] object-contain"
          />
        </div>
      )
    } else if (viewingFile.contentType === 'application/pdf') {
      return (
        <iframe 
          src={`${viewingFile.url}#toolbar=0`}
          className="w-full h-[70vh]" 
          title={viewingFile.name}
        />
      )
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p>This file type cannot be previewed.</p>
          <a
            href={viewingFile.url}
            target="_blank"
            rel="noopener noreferrer"
            download={viewingFile.name}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <Download className="h-4 w-4 mr-1" />
            <span>Download file</span>
          </a>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {record.isPermitted && (
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href={`/records/${record.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Record
            </Link>
          </Button>
        )}
      </div>

      <Card className="overflow-hidden border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Medical Record</CardTitle>
            <Badge variant="outline" className="bg-white">
              {formatDate(record.created_at)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient Name</h3>
              <p className="text-lg font-medium">{record.patient_name}</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Doctor Name</h3>
              <p className="text-lg font-medium">{record.doctor_name}</p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Diagnosis</h3>
              <p className="text-lg font-medium">{record.diagnosis}</p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h3>
              <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
                <p className="whitespace-pre-line">{record.notes}</p>
              </div>
            </div>

            {record.files && record.files.length > 0 && (
              <div className="space-y-2 md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Attachments</h3>
                <ul className="divide-y rounded-md border">
                  {record.files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-3">
                      <div className="flex items-center">
                        {getFileIcon(file.contentType)}
                        <span className="ml-2 text-sm">{file.name}</span>
                        <span className="ml-2 text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewFile(file)}
                          className="flex items-center text-blue-600 border-blue-200 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="text-sm">View</span>
                        </Button>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={file.name}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          <span className="text-sm">Download</span>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Record ID: {record.id}</p>
        </CardFooter>
      </Card>

      {/* File Viewer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewingFile?.name}</DialogTitle>
          </DialogHeader>
          {renderFileContent()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
