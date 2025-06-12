"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  type: "student" | "photographer" | "admin"
  avatar?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser({
          id: parsedUser.id,
          name: parsedUser.fullName || parsedUser.name,
          email: parsedUser.email,
          type: parsedUser.userType || parsedUser.type,
          avatar: parsedUser.avatar,
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  const login = (userData: any) => {
    const user = {
      id: userData.id,
      name: userData.fullName || userData.name,
      email: userData.email,
      type: userData.userType || userData.type,
      avatar: userData.avatar,
    }
    setUser(user)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  return { user, loading, logout, login }
}
