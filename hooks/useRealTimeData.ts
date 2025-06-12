"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// Simplified real-time data hook
export function useBookingData() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load data from localStorage
  const loadBookings = useCallback(() => {
    try {
      const stored = localStorage.getItem("userBookings")
      if (stored) {
        const parsed = JSON.parse(stored)
        setBookings(parsed)
      }
    } catch (error) {
      console.error("Error loading bookings:", error)
    }
  }, [])

  // Update bookings
  const updateBookings = useCallback((newBookings: any[]) => {
    try {
      localStorage.setItem("userBookings", JSON.stringify(newBookings))
      setBookings(newBookings)

      // Dispatch event for cross-component updates
      window.dispatchEvent(
        new CustomEvent("bookingsUpdated", {
          detail: newBookings,
        }),
      )
    } catch (error) {
      console.error("Error updating bookings:", error)
    }
  }, [])

  // Refresh data
  const refreshBookings = useCallback(() => {
    loadBookings()
  }, [loadBookings])

  // Initialize data only once
  useEffect(() => {
    if (!isInitialized) {
      loadBookings()
      setIsInitialized(true)
    }
  }, [isInitialized, loadBookings])

  // Set up event listeners
  useEffect(() => {
    // Listen for storage changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userBookings") {
        loadBookings()
      }
    }

    // Listen for custom events
    const handleBookingsUpdated = (e: CustomEvent) => {
      setBookings(e.detail)
    }

    // Listen for window focus
    const handleFocus = () => {
      loadBookings()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("bookingsUpdated", handleBookingsUpdated as EventListener)
    window.addEventListener("focus", handleFocus)

    // Set up polling (every 10 seconds)
    intervalRef.current = setInterval(() => {
      loadBookings()
    }, 10000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("bookingsUpdated", handleBookingsUpdated as EventListener)
      window.removeEventListener("focus", handleFocus)

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [loadBookings])

  return [bookings, updateBookings, refreshBookings] as const
}

// Utility functions
export function broadcastDataUpdate(type: string, data: any) {
  window.dispatchEvent(
    new CustomEvent("dataUpdate", {
      detail: { type, data },
    }),
  )
}

export function forceUpdateAllData() {
  window.dispatchEvent(new CustomEvent("forceUpdate"))
}
