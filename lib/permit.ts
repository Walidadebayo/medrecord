import { Permit } from "permitio"
import type { User } from "@/lib/types"

// Initialize Permit SDK
const permit = new Permit({
  pdp: "https://cloudpdp.api.permit.io",
  token: process.env.PERMIT_API_KEY || "permit_api_key",
})

interface CheckAccessParams {
  user: User
  resource: string
  action: string
  resourceId?: string
  resourceAttributes?: Record<string, any>
}

export async function checkAccess({
  user,
  resource,
  action,
  resourceId,
  resourceAttributes,
}: CheckAccessParams): Promise<boolean> {
  try {
    // Convert user to Permit user context
    const userContext = {
      key: user.id,  
      id: user.id,
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ").slice(1).join(" "),
      email: user.email,
      roles: [user.role],
      attributes: {
        role: user.role,
      },
    }

    // Check permission using Permit
    const permitted = await permit.check(userContext, action, {
      type: resource,
      key: resourceId,
      attributes: resourceAttributes,
    })

    return permitted
  } catch (error) {
    console.error("Permit.io check failed:", error)

    // Fallback to basic role-based checks if Permit fails
    return fallbackRoleCheck(user.role, resource, action, resourceAttributes)
  }
}

// Fallback function for when Permit.io is unavailable
function fallbackRoleCheck(
  role: string,
  resource: string,
  action: string,
  resourceAttributes?: Record<string, any>,
): boolean {
  if (resource === "medical_record") {
    switch (role) {
      case "admin":
        // Admin can do anything
        return true
      case "doctor":
        // Doctor can read all records, but only update their own
        if (action === "read") {
          return true
        }
        if (action === "update" && resourceAttributes?.doctor_name) {
          // Check if doctor is assigned to this record
          return true // In a real app, you'd check if the doctor is assigned
        }
        return false
      case "patient":
        // Patient can only read their own records
        if (action === "read" && resourceAttributes?.patient_name) {
          // Check if patient is the owner of this record
          return true // In a real app, you'd check if the patient is the owner
        }
        return false
      default:
        return false
    }
  }

  return false
}
