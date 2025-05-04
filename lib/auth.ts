import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { User, Session } from "@/lib/types";
import UserModel from "@/models/user";
import dbConnect from "@/lib/db";
import { createPermitUser } from "./permit";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function loginUser(
  username: string,
  password: string
): Promise<User | null> {
  try {
    await dbConnect();

    const user = await UserModel.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return null;
    }

    // Create a session
    const session = {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    // Create JWT token
    const token = await new SignJWT({ ...session })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(JWT_SECRET));

    // Store session in a cookie
    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return session.user;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

export async function getServerSession(): Promise<Session | null> {
  const sessionCookie = (await cookies()).get("session_token");

  if (!sessionCookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      sessionCookie.value,
      new TextEncoder().encode(JWT_SECRET)
    );

    return payload as unknown as Session;
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  (await cookies()).delete("session_token");
}

// Initialize database with default users if they don't exist
export async function initializeUsers() {
  try {
    await dbConnect();

    const count = await UserModel.countDocuments();
    
    if (count === 0) {
      // Create default users
      const createdUsers = await UserModel.create([
        {
          username: "admin",
          password: "2025DEVChallenge",
          name: "Admin User",
          email: "admin@medrecord.com",
          role: "admin",
        },
        {
          username: "drjohnson",
          password: "2025DEVChallenge",
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@medrecord.com",
          role: "doctor",
        },
        {
          username: "drwilliams",
          password: "2025DEVChallenge",
          name: "Dr. Robert Williams",
          email: "robert.williams@medrecord.com",
          role: "doctor",
        },
        {
          username: "jsmith",
          password: "2025DEVChallenge",
          name: "John Smith",
          email: "john.smith@example.com",
          role: "patient",
        },
        {
          username: "newuser",
          password: "2025DEVChallenge",
          name: "Emily Davis",
          email: "emily.davis@example.com",
          role: "patient",
        },
      ]);
      // for (const user of createdUsers) {
      //   await createUser(user);
      // }
    }
  } catch (error) {
    console.error("Error initializing users:", error);
  }
}
