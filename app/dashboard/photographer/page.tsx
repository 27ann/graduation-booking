"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, Camera, Star, TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import Link from "next/link"

interface PhotographerBooking {
  id: number
  studentName: string
  sessionName: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "completed"
  totalPrice: number
  photoSpots: string[]
  specialRequest?: string
}

export default function PhotographerDashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<PhotographerBooking[]>([])
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    rating: 0,
    completedSessions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPhotographerData = async () => {
      try {
        // Mock data untuk fotografer yang login
        const mockBookings: PhotographerBooking[] = [
          {
            id: 1,
            studentName: "Ahmad Rizky Pratama",
            sessionName: "Sesi Wisuda Pagi - Batch 1",
            date: "2024-06-15",
            startTime: "08:00",
            endTime: "10:00",
            status: "confirmed",
            totalPrice: 350000,
            photoSpots: ["Gedung Rektorat ITS", "Perpustakaan Pusat ITS"],
            specialRequest: "Mohon menyediakan props toga dan topi wisuda",
          },
          {
            id: 2,
            studentName: "Sari Indah Permata",
            sessionName: "Sesi Family Portrait",
            date: "2024-06-16",
            startTime: "13:00",
            endTime: "16:00",
            status: "pending",
            totalPrice: 450000,
            photoSpots: ["Taman Teknologi ITS", "Student Center ITS"],
          },
          {
            id: 3,
            studentName: "Budi Santoso",
            sessionName: "Sesi Individual Portrait",
            date: "2024-06-12",
            startTime: "14:00",
            endTime: "16:00",
            status: "completed",
            totalPrice: 320000,
            photoSpots: ["Perpustakaan Pusat ITS"],
          },
        ]

        setBookings(mockBookings)
        setStats({
          totalBookings: mockBookings.length,
          confirmedBookings: mockBookings.filter((b) => b.status === "confirmed").length,
          pendingBookings: mockBookings.filter((b) => b.status === "pending").length,
          totalRevenue: mockBookings
            .filter((b) => b.status === "confirmed" || b.status === "completed")
            .reduce((sum, b) => sum + b.totalPrice, 0),
          rating: 4.8,
          completedSessions: mockBookings.filter((b) => b.status === "completed").length,
        })
      } catch (error) {
        console.error("Error fetching photographer data:", error)
      }
      setLoading(false)
    }

    fetchPhotographerData()
  }, [])

  const handleConfirmBooking = async (bookingId: number) => {
    try {
      // Update booking status to confirmed
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "confirmed" as const } : booking)),
      )

      // Update stats
      setStats((prev) => ({
        ...prev,
        confirmedBookings: prev.confirmedBookings + 1,
        pendingBookings: prev.pendingBookings - 1,
      }))
    } catch (error) {
      console.error("Error confirming booking:", error)
    }
  }

  const handleRejectBooking = async (bookingId: number) => {
    try {
      // Remove booking from list (or set status to rejected)
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId))

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalBookings: prev.totalBookings - 1,
        pendingBookings: prev.pendingBookings - 1,
      }))
    } catch (error) {
      console.error("Error rejecting booking:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Dikonfirmasi"
      case "pending":
        return "Menunggu Konfirmasi"
      case "completed":
        return "Selesai"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </RoleBasedLayout>
    )
  }

  return (
    <AuthGuard requiredUserType={["photographer"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Fotografer</h2>
            <p className="text-gray-600">Selamat datang, {user?.fullName}! Kelola jadwal dan booking Anda di sini.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">Semua booking masuk</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {stats.totalRevenue.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">Total pendapatan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rating}</div>
                <p className="text-xs text-muted-foreground">Rating rata-rata</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sesi Selesai</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedSessions}</div>
                <p className="text-xs text-muted-foreground">Sesi foto selesai</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Kelola bisnis fotografi Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Button asChild className="h-20 flex-col">
                  <Link href="/photographer/schedule">
                    <Calendar className="h-6 w-6 mb-2" />
                    Atur Jadwal
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link href="/photographer/bookings">
                    <Users className="h-6 w-6 mb-2" />
                    Kelola Booking
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link href="/photographer/portfolio">
                    <Camera className="h-6 w-6 mb-2" />
                    Update Portfolio
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link href="/photographer/earnings">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Laporan Pendapatan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Bookings */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                Booking Menunggu Konfirmasi ({stats.pendingBookings})
              </CardTitle>
              <CardDescription>Booking yang memerlukan konfirmasi Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings
                  .filter((b) => b.status === "pending")
                  .map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{booking.sessionName}</h4>
                          <p className="text-sm text-gray-600">Client: {booking.studentName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">Rp {booking.totalPrice.toLocaleString("id-ID")}</p>
                          <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{new Date(booking.date).toLocaleDateString("id-ID")}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Lokasi: {booking.photoSpots.join(", ")}</p>
                          {booking.specialRequest && (
                            <p className="text-xs text-gray-500 mt-1">
                              <strong>Permintaan:</strong> {booking.specialRequest}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleRejectBooking(booking.id)}>
                          Tolak
                        </Button>
                        <Button size="sm" onClick={() => handleConfirmBooking(booking.id)}>
                          Konfirmasi
                        </Button>
                      </div>
                    </div>
                  ))}

                {bookings.filter((b) => b.status === "pending").length === 0 && (
                  <div className="text-center py-4 text-gray-500">Tidak ada booking yang menunggu konfirmasi</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Terbaru</CardTitle>
              <CardDescription>Daftar semua booking Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{booking.sessionName}</h4>
                        <p className="text-sm text-gray-600">Client: {booking.studentName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">Rp {booking.totalPrice.toLocaleString("id-ID")}</p>
                        <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(booking.date).toLocaleDateString("id-ID")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Lokasi: {booking.photoSpots.join(", ")}</p>
                        {booking.specialRequest && (
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Permintaan:</strong> {booking.specialRequest}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
