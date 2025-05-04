import { Permit } from "permitio";
import type { User } from "@/lib/types";

// Initialize Permit SDK
export const permit = new Permit({
  // pdp: "https://cloudpdp.api.permit.io",
  pdp: process.env.PERMIT_PDP_URL || "http://localhost:7766",
  token: process.env.PERMIT_API_KEY || "permit_api_key",
});

interface CheckAccessParams {
  user: User;
  resource: string;
  action: string;
  resourceId?: string;
  resourceAttributes?: Record<string, any>;
}

export async function createPermitUser(user: User): Promise<void> {
  try {
    const role =
      user.role === "doctor"
        ? "editor"
        : user.role === "patient"
        ? "viewer"
        : user.role;
    const y = await permit.api.createUser({
      key: user.id.toString(),
      email: user.email,
      first_name: user.name.split(" ")[0],
      last_name: user.name.split(" ").slice(1).join(" "),
      attributes: {
        role,
      },
      role_assignments: [
        {
          role: user.role,
          resource_instance: "medical_record",
          tenant: "default",
        },
      ],
    });
    console.log("User created in Permit.io:", y);
  } catch (error) {
    console.error("Error creating user in Permit.io:", error);
  }
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
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ").slice(1).join(" "),
      email: user.email,
      roles: [user.role],
      attributes: {
        role: user.role,
      },
    };

    // Check permission using Permit
    let permitted = await permit.check(userContext, action, {
      type: resource,
      key: resourceId,
      attributes: resourceAttributes,
    });

    if (!permitted) {
      // fallback to role-based access control
      permitted = fallbackRoleCheck(
        user.role,
        resource,
        action,
        resourceAttributes,
        user.name
      );
    }

    return permitted;
  } catch (error) {
    console.error("Permit.io check failed:", error);
    return fallbackRoleCheck(
      user.role,
      resource,
      action,
      resourceAttributes,
      user.name
    );
  }
}

// Fallback function for when Permit.io is unavailable
function fallbackRoleCheck(
  role: string,
  resource: string,
  action: string,
  resourceAttributes?: Record<string, any>,
  userName?: string
): boolean {
  if (resource === "medical_record") {
    switch (role) {
      case "admin":
        return true;

      case "doctor":
        if (action === "read") return true;

        if (action === "update" && resourceAttributes?.doctor_id) {
          return resourceAttributes.doctor_name === userName;
        }
        return false;

      case "patient":
        if (action === "read" && resourceAttributes?.patient_id) {
          return resourceAttributes.patient_name === userName;
        }
        return false;

      default:
        return false;
    }
  }

  return false;
}
