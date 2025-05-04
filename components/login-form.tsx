"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">MedRecord</CardTitle>
        <CardDescription className="text-blue-100">
          Sign in to access your medical records
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          {/* Login Form */}
          <div className="flex-1">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300"
                />
              </div>
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Credentials Section */}
          <div className="flex-1 border-t  pt-6 lg:pt-0 lg:pl-6">
            <div className="text-sm space-y-3">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <div className="grid gap-3">
                {/* Admin */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="font-medium text-blue-600 mb-1.5">Admin:</p>
                  <div className="bg-white/60 rounded px-2 py-1">
                    <div>
                      <span className="font-semibold">Username:</span>{" "}
                      <span className="font-mono">admin</span>
                    </div>
                    <div>
                      <span className="font-semibold">Password:</span>{" "}
                      <span className="font-mono">2025DEVChallenge</span>
                    </div>
                  </div>
                </div>

                {/* Doctors */}
                <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                  <p className="font-medium text-green-600 mb-1.5">Doctors:</p>
                  <div className="space-y-1.5">
                    <div className="bg-white/60 rounded px-2 py-1">
                      <div>
                        <span className="font-semibold">Username:</span>{" "}
                        <span className="font-mono">drjohnson</span>
                      </div>
                      <div>
                        <span className="font-semibold">Password:</span>{" "}
                        <span className="font-mono">2025DEVChallenge</span>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded px-2 py-1">
                      <div>
                        <span className="font-semibold">Username:</span>{" "}
                        <span className="font-mono">drwilliams</span>
                      </div>
                      <div>
                        <span className="font-semibold">Password:</span>{" "}
                        <span className="font-mono">2025DEVChallenge</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patients */}
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                  <p className="font-medium text-purple-600 mb-1.5">Patients:</p>
                  <div className="space-y-1.5">
                    <div className="bg-white/60 rounded px-2 py-1">
                      <div>
                        <span className="font-semibold">Username:</span>{" "}
                        <span className="font-mono">jsmith</span>
                      </div>
                      <div>
                        <span className="font-semibold">Password:</span>{" "}
                        <span className="font-mono">2025DEVChallenge</span>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded px-2 py-1">
                      <div>
                        <span className="font-semibold">Username:</span>{" "}
                        <span className="font-mono">newuser</span>
                      </div>
                      <div>
                        <span className="font-semibold">Password:</span>{" "}
                        <span className="font-mono">2025DEVChallenge</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
