"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  email: string
  fullName: string
  userType: string
}

interface AuthGuardProps {
  children: React.ReactNode
  requiredUserType?: string[]
}

export function AuthGuard({ children, requiredUserType }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = useCallback(() => {
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Check if user type is allowed
        if (requiredUserType && !requiredUserType.includes(parsedUser.userType)) {
          router.push("/unauthorized")
          return
        }
      } else {
        router.push("/login")
        return
      }
    } catch (error) {
      console.error("Auth error:", error)
      router.push("/login")
      return
    } finally {
      setLoading(false)
    }
  }, [router, requiredUserType])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/login"
  }, [])

  return { user, logout, loading }
}
