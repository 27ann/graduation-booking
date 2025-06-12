"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, DollarSign, Phone, Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"

interface Booking {
  id: number
  studentName: string
  studentEmail: string
  studentPhone: string
  sessionName: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  totalPrice: number
  photoSpots: string[]
  specialRequest?: string
  createdAt: string
}

export default function PhotographerBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Mock data untuk booking fotografer
        const mockBookings: Booking[] = [
          {
            id: 1,
            studentName: "Ahmad Rizky Pratama",
            studentEmail: "ahmad.rizky.2021@student.its.ac.id",
            studentPhone: "081234567890",
            sessionName: "Sesi Wisuda Pagi - Batch 1",
            date: "2024-06-15",
            startTime: "08:00",
            endTime: "10:00",
            status: "pending",
            totalPrice: 350000,
            photoSpots: ["Gedung Rektorat ITS", "Perpustakaan Pusat ITS"],
            specialRequest: "Mohon menyediakan props toga dan topi wisuda",
            createdAt: "2024-06-10T10:30:00Z",
          },
          {
            id: 2,
            studentName: "Sari Indah Permata",
            studentEmail: "sari.indah.2021@student.its.ac.id",
            studentPhone: "081234567891",
            sessionName: "Sesi Family Portrait",
            date: "2024-06-16",
            startTime: "13:00",
            endTime: "16:00",
            status: "confirmed",
            totalPrice: 450000,
            photoSpots: ["Taman Teknologi ITS", "Student Center ITS"],
            createdAt: "2024-06-08T14:20:00Z",
          },
          {
            id: 3,
            studentName: "Budi Santoso",
            studentEmail: "budi.santoso.2021@student.its.ac.id",
            studentPhone: "081234567892",
            sessionName: "Sesi Individual Portrait",
            date: "2024-06-12",
            startTime: "14:00",
            endTime: "16:00",
            status: "completed",
            totalPrice: 320000,
            photoSpots: ["Perpustakaan Pusat ITS"],
            createdAt: "2024-06-05T09:15:00Z",
          },
        ]

        setBookings(mockBookings)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      }
      setLoading(false)
    }

    fetchBookings()
  }, [])

  const handleConfirmBooking = async (bookingId: number) => {
    try {
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "confirmed" as const } : booking)),
      )
    } catch (error) {
      console.error("Error confirming booking:", error)
    }
  }

  const handleRejectBooking = async (bookingId: number) => {
    try {
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking)),
      )
    } catch (error) {
      console.error("Error rejecting booking:", error)
    }
  }

  const handleCompleteBooking = async (bookingId: number) => {
    try {
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "completed" as const } : booking)),
      )
    } catch (error) {
      console.error("Error completing booking:", error)
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
      case "cancelled":
        return "bg-red-100 text-red-800"
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
      case "cancelled":
        return "Dibatalkan"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const filterBookings = (status: string) => {
    if (status === "all") return bookings
    return bookings.filter((booking) => booking.status === status)
  }

  const getTabCount = (status: string) => {
    return filterBookings(status).length
  }

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat booking...</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Kelola Booking</h2>
            <p className="text-gray-600">Kelola semua booking yang masuk untuk layanan fotografi Anda</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Semua ({getTabCount("all")})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({getTabCount("pending")})</TabsTrigger>
              <TabsTrigger value="confirmed">Dikonfirmasi ({getTabCount("confirmed")})</TabsTrigger>
              <TabsTrigger value="completed">Selesai ({getTabCount("completed")})</TabsTrigger>
              <TabsTrigger value="cancelled">Dibatalkan ({getTabCount("cancelled")})</TabsTrigger>
            </TabsList>

            {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {filterBookings(status).length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">
                        Tidak ada booking {status === "all" ? "" : getStatusText(status).toLowerCase()}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filterBookings(status).map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{booking.sessionName}</CardTitle>
                            <CardDescription>
                              Booking dari {booking.studentName} •{" "}
                              {new Date(booking.createdAt).toLocaleDateString("id-ID")}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              Rp {booking.totalPrice.toLocaleString("id-ID")}
                            </p>
                            <div className="flex items-center justify-end space-x-2 mt-1">
                              {getStatusIcon(booking.status)}
                              <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Booking Details */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Detail Booking</h4>
                              <div className="space-y-2 text-sm">
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
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4 text-gray-500" />
                                  <span>Rp {booking.totalPrice.toLocaleString("id-ID")}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Lokasi Foto</h4>
                              <div className="text-sm text-gray-600">{booking.photoSpots.join(", ")}</div>
                            </div>

                            {booking.specialRequest && (
                              <div>
                                <h4 className="font-semibold mb-2">Permintaan Khusus</h4>
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {booking.specialRequest}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Student Contact */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Kontak Mahasiswa</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Nama:</span>
                                  <span className="font-medium">{booking.studentName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Email:</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm">{booking.studentEmail}</span>
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={`mailto:${booking.studentEmail}`}>
                                        <Mail className="h-3 w-3" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Telepon:</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm">{booking.studentPhone}</span>
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={`tel:${booking.studentPhone}`}>
                                        <Phone className="h-3 w-3" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                              {booking.status === "pending" && (
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleRejectBooking(booking.id)}
                                  >
                                    Tolak
                                  </Button>
                                  <Button className="flex-1" onClick={() => handleConfirmBooking(booking.id)}>
                                    Konfirmasi
                                  </Button>
                                </div>
                              )}

                              {booking.status === "confirmed" && (
                                <Button className="w-full" onClick={() => handleCompleteBooking(booking.id)}>
                                  Tandai Selesai
                                </Button>
                              )}

                              {booking.status === "completed" && (
                                <div className="text-center text-sm text-gray-500">Sesi foto telah selesai</div>
                              )}

                              {booking.status === "cancelled" && (
                                <div className="text-center text-sm text-red-500">Booking dibatalkan</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
