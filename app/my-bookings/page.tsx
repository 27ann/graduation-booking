"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
  RefreshCw,
} from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useBookingData } from "@/hooks/useRealTimeData"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface StudentBooking {
  id: number
  photographerName: string
  photographerPhone: string
  sessionName: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  totalPrice: number
  photoSpots: Array<{
    id: number
    name: string
    price: number
  }>
  specialRequest?: string
  createdAt: string
  updatedAt: string
  photographerId: number
  sessionId: number
}

export default function MyBookingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, updateBookings, refreshBookings] = useBookingData()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [lastUpdate, setLastUpdate] = useState<string>("")

  // Initialize with mock data if empty
  useEffect(() => {
    if (bookings.length === 0 && loading) {
      const mockBookings = [
        {
          id: 1,
          photographerName: "Studio Foto Kenzie",
          photographerPhone: "082111222333",
          sessionName: "Sesi Wisuda Pagi",
          date: "2024-06-15",
          startTime: "08:00",
          endTime: "10:00",
          status: "confirmed" as const,
          totalPrice: 350000,
          photoSpots: [
            { id: 1, name: "Gedung Rektorat ITS", price: 50000 },
            { id: 2, name: "Perpustakaan Pusat ITS", price: 40000 },
          ],
          specialRequest: "Mohon menyediakan props toga dan topi wisuda",
          createdAt: "2024-05-01T10:00:00Z",
          updatedAt: "2024-05-01T10:00:00Z",
          photographerId: 1,
          sessionId: 1,
        },
        {
          id: 2,
          photographerName: "Visual Art Studio",
          photographerPhone: "082111222334",
          sessionName: "Sesi Casual Campus",
          date: "2024-06-21",
          startTime: "13:00",
          endTime: "16:00",
          status: "pending" as const,
          totalPrice: 450000,
          photoSpots: [
            { id: 3, name: "Taman Teknologi ITS", price: 30000 },
            { id: 5, name: "Student Center ITS", price: 35000 },
          ],
          createdAt: "2024-05-10T14:00:00Z",
          updatedAt: "2024-05-10T14:00:00Z",
          photographerId: 2,
          sessionId: 19,
        },
      ]
      updateBookings(mockBookings)
    }
    setLoading(false)
  }, [bookings.length, loading, updateBookings])

  // Update timestamp when bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      setLastUpdate(new Date().toLocaleTimeString("id-ID"))
    }
  }, [bookings])

  const handleCancelBooking = (bookingId: number) => {
    if (confirm("Apakah Anda yakin ingin membatalkan booking ini?")) {
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "cancelled" as const,
              updatedAt: new Date().toISOString(),
            }
          : booking,
      )

      updateBookings(updatedBookings)
      toast.success("Booking berhasil dibatalkan!")
    }
  }

  const handleForceRefresh = () => {
    refreshBookings()
    toast.success("Data berhasil di-refresh!")
  }

  // Memoized calculations to prevent unnecessary re-renders
  const tabCounts = useMemo(
    () => ({
      all: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }),
    [bookings],
  )

  const filteredBookings = useMemo(() => {
    if (activeTab === "all") return bookings
    return bookings.filter((booking) => booking.status === activeTab)
  }, [bookings, activeTab])

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
        return "Menunggu Konfirmasi"
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
              <p className="mt-4 text-gray-600">Memuat booking Anda...</p>
            </div>
          </div>
        </RoleBasedLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredUserType={["student"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Saya</h2>
                <p className="text-gray-600">Kelola semua booking foto wisuda Anda</p>
                <p className="text-xs text-green-600 mt-1">🔄 Real-time • Last update: {lastUpdate}</p>
              </div>
              <Button onClick={handleForceRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tabCounts.all}</div>
                <p className="text-xs text-muted-foreground">Semua booking</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dikonfirmasi</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{tabCounts.confirmed}</div>
                <p className="text-xs text-muted-foreground">Booking terkonfirmasi</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{tabCounts.pending}</div>
                <p className="text-xs text-muted-foreground">Menunggu konfirmasi</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Biaya</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp{" "}
                  {bookings
                    .filter((b) => b.status === "confirmed" || b.status === "completed")
                    .reduce((sum, b) => sum + b.totalPrice, 0)
                    .toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-muted-foreground">Total yang dibayar</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Button */}
          <div className="mb-6">
            <Button onClick={() => router.push("/photographers")}>Buat Booking Baru</Button>
          </div>

          {/* Bookings List with Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Booking (Real-time)</CardTitle>
              <CardDescription>Kelola dan pantau status booking Anda - Update otomatis</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">Semua ({tabCounts.all})</TabsTrigger>
                  <TabsTrigger value="pending">Menunggu ({tabCounts.pending})</TabsTrigger>
                  <TabsTrigger value="confirmed">Dikonfirmasi ({tabCounts.confirmed})</TabsTrigger>
                  <TabsTrigger value="completed">Selesai ({tabCounts.completed})</TabsTrigger>
                  <TabsTrigger value="cancelled">Dibatalkan ({tabCounts.cancelled})</TabsTrigger>
                </TabsList>

                {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
                  <TabsContent key={status} value={status} className="space-y-4">
                    {status === activeTab &&
                      filteredBookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <h4 className="text-lg font-semibold">{booking.sessionName}</h4>
                              <Badge className={getStatusColor(booking.status)}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(booking.status)}
                                  <span>{getStatusText(booking.status)}</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">
                                Rp {booking.totalPrice.toLocaleString("id-ID")}
                              </p>
                              <p className="text-xs text-gray-500">Booking #{booking.id.toString().padStart(5, "0")}</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">Fotografer:</span>
                                <span className="font-medium">{booking.photographerName}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">Tanggal:</span>
                                <span className="font-medium">
                                  {new Date(booking.date).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">Waktu:</span>
                                <span className="font-medium">
                                  {booking.startTime} - {booking.endTime} WIB
                                </span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                <div>
                                  <span className="text-gray-600">Lokasi Foto:</span>
                                  <div className="font-medium">
                                    {booking.photoSpots.map((spot) => (
                                      <div key={spot.id} className="flex justify-between">
                                        <span>{spot.name}</span>
                                        <span className="text-blue-600">Rp {spot.price.toLocaleString("id-ID")}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {booking.specialRequest && (
                                <div className="text-sm">
                                  <span className="text-gray-600">Permintaan khusus:</span>
                                  <p className="font-medium mt-1">{booking.specialRequest}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-gray-500">
                              <p>Dibuat: {new Date(booking.createdAt).toLocaleDateString("id-ID")}</p>
                              <p>Diupdate: {new Date(booking.updatedAt).toLocaleDateString("id-ID")}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/booking/${booking.id}`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Detail
                                </Link>
                              </Button>
                              {booking.status === "pending" && (
                                <>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/booking/${booking.id}/edit`}>
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelBooking(booking.id)}
                                  >
                                    Batalkan
                                  </Button>
                                </>
                              )}
                              {booking.status === "confirmed" && (
                                <Button variant="outline" size="sm">
                                  <a href={`tel:${booking.photographerPhone}`}>Hubungi Fotografer</a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                    {status === activeTab && filteredBookings.length === 0 && (
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {status === "all"
                            ? "Belum ada booking"
                            : `Tidak ada booking ${getStatusText(status).toLowerCase()}`}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {status === "all"
                            ? "Mulai booking foto wisuda pertama Anda!"
                            : `Anda belum memiliki booking dengan status ${getStatusText(status).toLowerCase()}`}
                        </p>
                        {status === "all" && (
                          <Button asChild>
                            <Link href="/photographers">Mulai Booking</Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <ScrollToTop />
      </RoleBasedLayout>
    </AuthGuard>
  )
}
