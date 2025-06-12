"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Edit,
  Star,
  Camera,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import Link from "next/link"

interface BookingDetail {
  id: number
  photographerName: string
  photographerPhone: string
  photographerEmail: string
  photographerRating: number
  photographerSpecialty: string
  sessionName: string
  sessionDescription: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  totalPrice: number
  photographerPrice: number
  spotsPrice: number
  photoSpots: Array<{
    id: number
    name: string
    price: number
    location: string
    facilities: string[]
  }>
  specialRequest?: string
  createdAt: string
  updatedAt: string
  photographerId: number
  sessionId: number
  paymentStatus?: "pending" | "paid" | "refunded"
  notes?: string
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        // Mock booking detail data
        const mockBookingDetail: BookingDetail = {
          id: Number(bookingId),
          photographerName: "Studio Foto Kenzie",
          photographerPhone: "082111222333",
          photographerEmail: "foto.studio1@its.ac.id",
          photographerRating: 4.8,
          photographerSpecialty: "Graduation & Portrait",
          sessionName: "Sesi Wisuda Pagi - Batch 1",
          sessionDescription:
            "Sesi foto wisuda pagi yang ideal untuk foto formal dengan pencahayaan natural terbaik. Cocok untuk foto individual, keluarga, dan group kecil.",
          date: "2024-06-15",
          startTime: "08:00",
          endTime: "10:00",
          status: "confirmed",
          totalPrice: 350000,
          photographerPrice: 300000,
          spotsPrice: 90000,
          photoSpots: [
            {
              id: 1,
              name: "Gedung Rektorat ITS",
              price: 50000,
              location: "Jl. Arief Rahman Hakim, Sukolilo",
              facilities: ["Ruang tunggu", "Toilet", "Area parkir"],
            },
            {
              id: 2,
              name: "Perpustakaan Pusat ITS",
              price: 40000,
              location: "Kampus ITS Sukolilo",
              facilities: ["AC", "Toilet", "Area baca"],
            },
          ],
          specialRequest: "Mohon menyediakan props toga dan topi wisuda. Sesi foto untuk keluarga 4 orang.",
          createdAt: "2024-05-01T10:00:00Z",
          updatedAt: "2024-05-02T14:30:00Z",
          photographerId: 1,
          sessionId: 1,
          paymentStatus: "paid",
          notes: "Booking dikonfirmasi oleh fotografer. Silakan datang 15 menit sebelum jadwal.",
        }

        setBooking(mockBookingDetail)
      } catch (error) {
        console.error("Error fetching booking detail:", error)
      }
      setLoading(false)
    }

    fetchBookingDetail()
  }, [bookingId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "refunded":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCancelBooking = async () => {
    if (confirm("Apakah Anda yakin ingin membatalkan booking ini?")) {
      try {
        // Mock cancel booking
        setBooking((prev) =>
          prev
            ? {
                ...prev,
                status: "cancelled",
                updatedAt: new Date().toISOString(),
                paymentStatus: "refunded",
              }
            : null,
        )
        alert("Booking berhasil dibatalkan")
      } catch (error) {
        alert("Gagal membatalkan booking")
      }
    }
  }

  if (loading) {
    return (
      <AuthGuard requiredUserType={["student"]}>
        <RoleBasedLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat detail booking...</p>
            </div>
          </div>
        </RoleBasedLayout>
      </AuthGuard>
    )
  }

  if (!booking) {
    return (
      <AuthGuard requiredUserType={["student"]}>
        <RoleBasedLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking tidak ditemukan</h2>
              <p className="text-gray-600 mb-4">Booking yang Anda cari tidak tersedia</p>
              <Button asChild>
                <Link href="/my-bookings">Kembali ke Daftar Booking</Link>
              </Button>
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
          {/* Back Button */}
          <Button variant="outline" className="mb-6" asChild>
            <Link href="/my-bookings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Booking
            </Link>
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{booking.sessionName}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        Booking #{booking.id.toString().padStart(5, "0")}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)} className="mb-2">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(booking.status)}
                          <span>{getStatusText(booking.status)}</span>
                        </div>
                      </Badge>
                      {booking.paymentStatus && (
                        <div>
                          <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                            {booking.paymentStatus === "paid"
                              ? "Dibayar"
                              : booking.paymentStatus === "pending"
                                ? "Menunggu Pembayaran"
                                : "Dikembalikan"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{booking.sessionDescription}</p>
                  {booking.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Catatan:</strong> {booking.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Session Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detail Sesi Foto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Tanggal</p>
                          <p className="text-gray-600">
                            {new Date(booking.date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Waktu</p>
                          <p className="text-gray-600">
                            {booking.startTime} - {booking.endTime} WIB
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Total Biaya</p>
                          <p className="text-gray-600 text-lg font-semibold">
                            Rp {booking.totalPrice.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Camera className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Durasi</p>
                          <p className="text-gray-600">2 jam</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photographer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Fotografer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{booking.photographerName}</h3>
                      <p className="text-gray-600">{booking.photographerSpecialty}</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{booking.photographerRating}</span>
                        <span className="ml-2 text-sm text-gray-500">Rating</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a href={`tel:${booking.photographerPhone}`} className="text-blue-600 hover:underline">
                            {booking.photographerPhone}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a href={`mailto:${booking.photographerEmail}`} className="text-blue-600 hover:underline">
                            {booking.photographerEmail}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photo Spots */}
              <Card>
                <CardHeader>
                  <CardTitle>Lokasi Foto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {booking.photoSpots.map((spot) => (
                      <div key={spot.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{spot.name}</h4>
                          <span className="font-medium text-blue-600">Rp {spot.price.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{spot.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {spot.facilities.map((facility, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Special Request */}
              {booking.specialRequest && (
                <Card>
                  <CardHeader>
                    <CardTitle>Permintaan Khusus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{booking.specialRequest}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Rincian Biaya</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Fotografer (2 jam)</span>
                    <span className="font-medium">Rp {booking.photographerPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Lokasi Foto</span>
                    <span className="font-medium">Rp {booking.spotsPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">Rp {booking.totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dibuat</span>
                    <span className="font-medium">{new Date(booking.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Terakhir diupdate</span>
                    <span className="font-medium">{new Date(booking.updatedAt).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status Pembayaran</span>
                    <Badge className={getPaymentStatusColor(booking.paymentStatus || "pending")}>
                      {booking.paymentStatus === "paid"
                        ? "Dibayar"
                        : booking.paymentStatus === "pending"
                          ? "Pending"
                          : "Dikembalikan"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {booking.status === "pending" && (
                    <>
                      <Button className="w-full" asChild>
                        <Link href={`/booking/${booking.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Booking
                        </Link>
                      </Button>
                      <Button variant="destructive" className="w-full" onClick={handleCancelBooking}>
                        Batalkan Booking
                      </Button>
                    </>
                  )}

                  {booking.status === "confirmed" && (
                    <>
                      <Button className="w-full" asChild>
                        <a href={`tel:${booking.photographerPhone}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Hubungi Fotografer
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`mailto:${booking.photographerEmail}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Email Fotografer
                        </a>
                      </Button>
                    </>
                  )}

                  {booking.status === "completed" && (
                    <Button className="w-full" asChild>
                      <Link href={`/booking/${booking.id}/review`}>
                        <Star className="mr-2 h-4 w-4" />
                        Beri Rating & Review
                      </Link>
                    </Button>
                  )}

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/my-bookings">Kembali ke Daftar Booking</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
