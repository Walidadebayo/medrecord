"use client"

import type React from "react"

import { createContext, useContext, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"

interface PermitContextType {
  checkPermission: (resource: string, action: string, resourceId?: string) => boolean
}

const PermitContext = createContext<PermitContextType | undefined>(undefined)

export function PermitProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Client-side permission check (simplified for demo)
  const checkPermission = useCallback(
    (resource: string, action: string, resourceId?: string): boolean => {
      if (!user) return false

      // In a real app, you would call the Permit.io API
      // For this demo, we'll use a simplified role-based check
      if (resource === "medical_record") {
        switch (user.role) {
          case "admin":
            // Admin can do anything
            return true
          case "doctor":
            // Doctor can read all records, but only update their own
            if (action === "read") {
              return true
            }
            if (action === "update") {
              // In a real app, you'd check if the doctor is assigned to this record
              return true
            }
            return false
          case "patient":
            // Patient can only read their own records
            if (action === "read") {
              // In a real app, you'd check if the patient is the owner of this record
              return true
            }
            return false
          default:
            return false
        }
      }

      return false
    },
    [user],
  )

  return <PermitContext.Provider value={{ checkPermission }}>{children}</PermitContext.Provider>
}

export function usePermit() {
  const context = useContext(PermitContext)
  if (context === undefined) {
    throw new Error("usePermit must be used within a PermitProvider")
  }
  return context
}
