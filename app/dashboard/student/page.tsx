"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Camera,
  MapPin,
  Clock,
  Star,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
} from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useBookingData } from "@/hooks/useRealTimeData"
import Link from "next/link"
import { toast } from "sonner"

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [bookings, , refreshBookings] = useBookingData()
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  // Set loading to false after initial render
  useEffect(() => {
    setLoading(false)
  }, [])

  // Update timestamp when bookings change
  useEffect(() => {
    if (bookings.length >= 0) {
      setLastUpdate(new Date().toLocaleTimeString("id-ID"))
    }
  }, [bookings])

  // Memoized calculations
  const stats = useMemo(() => {
    const totalBookings = bookings.length
    const completedBookings = bookings.filter((b: any) => b.status === "completed").length
    const confirmedBookings = bookings.filter((b: any) => b.status === "confirmed").length
    const pendingBookings = bookings.filter((b: any) => b.status === "pending").length
    const upcomingBookings = confirmedBookings + pendingBookings
    const totalSpent = bookings
      .filter((b: any) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0)

    return {
      totalBookings,
      completedBookings,
      upcomingBookings,
      pendingBookings,
      totalSpent,
    }
  }, [bookings])

  const recentBookings = useMemo(() => {
    const transformedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      photographerName: booking.photographerName,
      sessionName: booking.sessionName,
      sessionDate: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      location: booking.photoSpots?.[0]?.name || "Lokasi tidak tersedia",
      status: booking.status,
      price: booking.totalPrice,
      createdAt: booking.createdAt,
    }))

    return transformedBookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [bookings])

  const handleForceRefresh = () => {
    refreshBookings()
    toast.success("Dashboard berhasil di-refresh!")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Dikonfirmasi"
      case "pending":
        return "Menunggu"
      case "cancelled":
        return "Dibatalkan"
      case "completed":
        return "Selesai"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <AuthGuard requiredUserType={["student"]}>
        <RoleBasedLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat dashboard...</p>
            </div>
          </div>
        </RoleBasedLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredUserType={["student"]}>
      <RoleBasedLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Mahasiswa</h2>
              <p className="text-gray-600">Selamat datang, {user?.fullName}! Kelola booking foto wisuda Anda.</p>
              <p className="text-xs text-green-600 mt-1">🔄 Real-time Dashboard • Last update: {lastUpdate}</p>
            </div>
            <Button onClick={handleForceRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">Semua booking Anda</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Menunggu Konfirmasi</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
                <p className="text-xs text-muted-foreground">Booking pending</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Booking Mendatang</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.upcomingBookings}</div>
                <p className="text-xs text-muted-foreground">Sesi akan datang</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {stats.totalSpent.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">Total biaya booking</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Kelola booking foto wisuda Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Button asChild className="h-20 flex-col hover:scale-105 transition-transform">
                  <Link href="/photographers">
                    <Camera className="h-6 w-6 mb-2" />
                    Cari Fotografer
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col hover:scale-105 transition-transform">
                  <Link href="/photo-spots">
                    <MapPin className="h-6 w-6 mb-2" />
                    Pilih Lokasi
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col hover:scale-105 transition-transform">
                  <Link href="/sessions">
                    <Calendar className="h-6 w-6 mb-2" />
                    Lihat Sesi
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col hover:scale-105 transition-transform">
                  <Link href="/my-bookings">
                    <BookOpen className="h-6 w-6 mb-2" />
                    Booking Saya
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Booking Terbaru (Real-time)</CardTitle>
                <CardDescription>Riwayat booking foto wisuda Anda - Update otomatis</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/my-bookings">Lihat Semua</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors hover:shadow-md"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Camera className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.sessionName}</h4>
                          <p className="text-sm text-gray-600">{booking.photographerName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.sessionDate).toLocaleDateString("id-ID")} • {booking.startTime} -{" "}
                            {booking.endTime}
                          </p>
                          <p className="text-xs text-gray-400">{booking.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium mb-1">Rp {booking.price.toLocaleString("id-ID")}</p>
                        <Badge className={getStatusColor(booking.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(booking.status)}
                            <span>{getStatusText(booking.status)}</span>
                          </div>
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(booking.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada booking</h3>
                    <p className="text-gray-600 mb-4">Mulai booking foto wisuda pertama Anda!</p>
                    <Button asChild>
                      <Link href="/photographers">Mulai Booking</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Tips Foto Wisuda
              </CardTitle>
              <CardDescription>Tips untuk mendapatkan foto wisuda terbaik</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Persiapan Sebelum Foto</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Pastikan toga dalam kondisi bersih dan rapi</li>
                    <li>• Siapkan makeup natural untuk hasil terbaik</li>
                    <li>• Datang 15 menit sebelum jadwal</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2">Saat Sesi Foto</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Ikuti arahan fotografer dengan baik</li>
                    <li>• Jangan ragu untuk meminta pose ulang</li>
                    <li>• Manfaatkan golden hour untuk hasil optimal</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <ScrollToTop />
      </RoleBasedLayout>
    </AuthGuard>
  )
}
