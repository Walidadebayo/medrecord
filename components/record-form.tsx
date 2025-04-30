"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Upload, X, FileText, ImageIcon, FileIcon } from "lucide-react"
import type { MedicalRecord, FileAttachment } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface RecordFormProps {
  record?: MedicalRecord
}

export default function RecordForm({ record }: RecordFormProps) {
  const isEditing = !!record
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const [formData, setFormData] = useState({
    patient_name: record?.patient_name || "",
    doctor_name: record?.doctor_name || "",
    diagnosis: record?.diagnosis || "",
    notes: record?.notes || "",
    files: record?.files || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 100)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload file")
      }

      const fileData: FileAttachment = await response.json()

      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, fileData],
      }))
    } catch (err: any) {
      setError(err.message || "Failed to upload file")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const url = isEditing ? `/api/records/${record.id}` : "/api/records"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save record")
      }
    } catch (err) {
      setError("An error occurred while saving the record")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card className="overflow-hidden border-0 shadow-md">
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patient_name">Patient Name</Label>
                <Input
                  id="patient_name"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-gray-950"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor_name">Doctor Name</Label>
                <Input
                  id="doctor_name"
                  name="doctor_name"
                  value={formData.doctor_name}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-gray-950"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-gray-950"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={5}
                  className="resize-none bg-white dark:bg-gray-950"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Attachments</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full border-dashed"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload Files"}
                  </Button>

                  {isUploading && (
                    <div className="mt-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-center mt-1">{uploadProgress}%</p>
                    </div>
                  )}

                  {formData.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium">Attached Files</h4>
                      <ul className="divide-y rounded-md border">
                        {formData.files.map((file, index) => (
                          <li key={index} className="flex items-center justify-between p-3">
                            <div className="flex items-center">
                              {getFileIcon(file.contentType)}
                              <span className="ml-2 text-sm">{file.name}</span>
                              <span className="ml-2 text-xs text-gray-500">({formatFileSize(file.size)})</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-800 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Record"
                  : "Create Record"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
