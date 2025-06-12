"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      // Redirect based on user type
      if (user.userType === "admin") {
        router.push("/dashboard/admin")
      } else if (user.userType === "photographer") {
        router.push("/dashboard/photographer")
      } else {
        router.push("/dashboard/student")
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user))

        // Force page reload to ensure proper state update
        if (data.user.userType === "admin") {
          window.location.href = "/dashboard/admin"
        } else if (data.user.userType === "photographer") {
          window.location.href = "/dashboard/photographer"
        } else {
          window.location.href = "/dashboard/student"
        }
      } else {
        setError(data.message || "Login gagal")
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login")
    }
    setLoading(false)
  }

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Camera className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Masuk ke akun ITS Graduation Photo Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@student.its.ac.id"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Masuk..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Demo Accounts:</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => handleDemoLogin("ahmad.rizky.2021@student.its.ac.id", "password123")}
              >
                <div className="text-left">
                  <div className="font-medium">Mahasiswa</div>
                  <div className="text-xs text-gray-500">ahmad.rizky.2021@student.its.ac.id</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => handleDemoLogin("foto.studio1@its.ac.id", "password123")}
              >
                <div className="text-left">
                  <div className="font-medium">Fotografer</div>
                  <div className="text-xs text-gray-500">foto.studio1@its.ac.id</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => handleDemoLogin("admin.foto@its.ac.id", "password123")}
              >
                <div className="text-left">
                  <div className="font-medium">Admin</div>
                  <div className="text-xs text-gray-500">admin.foto@its.ac.id</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
