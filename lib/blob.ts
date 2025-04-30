import { put, del } from "@vercel/blob"
import crypto from "crypto"

export async function uploadFile(file: File): Promise<{
  url: string
  name: string
  contentType: string
  size: number
}> {
  try {
    const filename = `${crypto.randomBytes(8).toString('hex')}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    })

    return {
      url: blob.url,
      name: file.name,
      contentType: file.type,
      size: file.size,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Failed to upload file")
  }
}

export async function deleteFile(url: string): Promise<boolean> {
  try {
    await del(url)
    return true
  } catch (error) {
    console.error("Error deleting file:", error)
    return false
  }
}
