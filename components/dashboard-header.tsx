"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, X, Plus, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import type { User as UserType } from "@/lib/types"

interface DashboardHeaderProps {
  user: UserType
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "doctor":
        return "bg-blue-100 text-blue-800"
      case "patient":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MedRecord
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {user.role === "admin" && (
              <Button
                asChild
                variant="default"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/records/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Record
                </Link>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <span
                      className={cn(
                        "mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getRoleColor(user.role),
                      )}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {user.role === "admin" && (
              <Link
                href="/records/new"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  New Record
                </div>
              </Link>
            )}
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.email}</div>
                  <span
                    className={cn(
                      "mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      getRoleColor(user.role),
                    )}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
