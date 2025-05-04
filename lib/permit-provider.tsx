"use client"

import type React from "react"

import { createContext, useContext, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { checkAccess } from "./permit"
import { MedicalRecord } from "./types"

interface PermitContextType {
  checkPermission: (resource: string, action: string, record: MedicalRecord) => Promise<boolean>
}

const PermitContext = createContext<PermitContextType | undefined>(undefined)

export function PermitProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Client-side permission check (simplified for demo)
  const checkPermission = useCallback(
    async (resource: string, action: string, record: MedicalRecord): Promise<boolean> => {
      if (!user) return false
      return await checkAccess({
        user,
        resource,
        action,
        resourceId: record.id,
        resourceAttributes: {
          patient_name: record.patient_name,
          doctor_name: record.doctor_name,
        },
      })
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
