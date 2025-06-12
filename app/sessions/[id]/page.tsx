"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Camera, Calendar, Clock, Users, MapPin, DollarSign, ArrowLeft, Star } from "lucide-react"

interface SessionDetail {
  ps_id: number
  ps_name: string
  ps_date: string
  ps_starttime: string
  ps_endtime: string
  ps_status: string
  description: string
  available_spots: number
  total_bookings: number
  avg_price: number
  recommended_photographers: Array<{
    id: number
    name: string
    rating: number
    price: number
    specialty: string
  }>
  popular_spots: Array<{
    id: number
    name: string
    price: number
    bookings: number
  }>
}

export default function SessionDetailPage() {
  const params = useParams()
  const sessionId = params.id
  const [session, setSession] = useState<SessionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessionDetail = async () => {
      try {
        // Mock session detail data
        const mockSessionDetail: SessionDetail = {
          ps_id: Number(sessionId),
          ps_name: "Sesi Wisuda Pagi - Batch 1",
          ps_date: "2024-06-15",
          ps_starttime: "08:00:00",
          ps_endtime: "10:00:00",
          ps_status: "available",
          description:
            "Sesi foto wisuda pagi yang ideal untuk foto formal dengan pencahayaan natural terbaik. Cocok untuk foto individual, keluarga, dan group kecil. Durasi 2 jam dengan berbagai pose dan lokasi.",
          available_spots: 8,
          total_bookings: 2,
          avg_price: 350000,
          recommended_photographers: [
            {
              id: 1,
              name: "Studio Foto Kenzie",
              rating: 4.8,
              price: 150000,
              specialty: "Graduation & Portrait",
            },
            {
              id: 2,
              name: "Visual Art Studio",
              rating: 4.9,
              price: 200000,
              specialty: "Wedding & Graduation",
            },
            {
              id: 4,
              name: "ITS Photo Pro",
              rating: 4.7,
              price: 180000,
              specialty: "Professional Portrait",
            },
          ],
          popular_spots: [
            {
              id: 1,
              name: "Gedung Rektorat ITS",
              price: 50000,
              bookings: 15,
            },
            {
              id: 2,
              name: "Perpustakaan Pusat ITS",
              price: 40000,
              bookings: 12,
            },
            {
              id: 3,
              name: "Taman Teknologi ITS",
              price: 30000,
              bookings: 20,
            },
          ],
        }

        setSession(mockSessionDetail)
      } catch (error) {
        console.error("Error fetching session detail:", error)
      }
      setLoading(false)
    }

    fetchSessionDetail()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail sesi...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sesi tidak ditemukan</h2>
          <p className="text-gray-600 mb-4">Sesi foto yang Anda cari tidak tersedia</p>
          <Button asChild>
            <Link href="/sessions">Kembali ke Daftar Sesi</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "full":
        return "bg-red-100 text-red-800"
      case "limited":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ITS Graduation Photo</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/photographers" className="text-gray-600 hover:text-blue-600">
                Fotografer
              </Link>
              <Link href="/photo-spots" className="text-gray-600 hover:text-blue-600">
                Lokasi Foto
              </Link>
              <Link href="/sessions" className="text-blue-600 font-medium">
                Sesi Foto
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="outline" className="mb-6" asChild>
          <Link href="/sessions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Sesi
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{session.ps_name}</CardTitle>
                  <Badge className={getStatusColor(session.ps_status)}>
                    {session.ps_status === "available"
                      ? "Tersedia"
                      : session.ps_status === "limited"
                        ? "Terbatas"
                        : session.ps_status === "full"
                          ? "Penuh"
                          : session.ps_status}
                  </Badge>
                </div>
                <CardDescription className="text-base">{session.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Tanggal</p>
                        <p className="text-gray-600">
                          {new Date(session.ps_date).toLocaleDateString("id-ID", {
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
                          {session.ps_starttime} - {session.ps_endtime} WIB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Ketersediaan</p>
                        <p className="text-gray-600">
                          {session.available_spots} slot tersisa dari {session.available_spots + session.total_bookings}{" "}
                          total
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Harga Rata-rata</p>
                        <p className="text-gray-600">Rp {session.avg_price.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Photographers */}
            <Card>
              <CardHeader>
                <CardTitle>Fotografer Rekomendasi</CardTitle>
                <CardDescription>Fotografer terbaik yang tersedia untuk sesi ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {session.recommended_photographers.map((photographer) => (
                    <div key={photographer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{photographer.name}</h4>
                        <p className="text-sm text-gray-600">{photographer.specialty}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{photographer.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">Rp {photographer.price.toLocaleString("id-ID")}/jam</p>
                        <Button size="sm" className="mt-2" asChild>
                          <Link
                            href={`/booking?photographer=${photographer.id}&session=${session.ps_id}&date=${session.ps_date}`}
                          >
                            Pilih
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Spots */}
            <Card>
              <CardHeader>
                <CardTitle>Lokasi Foto Populer</CardTitle>
                <CardDescription>Lokasi yang sering dipilih untuk sesi ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {session.popular_spots.map((spot) => (
                    <div key={spot.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">{spot.name}</p>
                          <p className="text-sm text-gray-600">{spot.bookings} booking</p>
                        </div>
                      </div>
                      <p className="font-medium text-blue-600">Rp {spot.price.toLocaleString("id-ID")}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Sesi Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{session.available_spots}</div>
                  <p className="text-gray-600">Slot tersedia</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durasi</span>
                    <span className="font-medium">2 jam</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga mulai dari</span>
                    <span className="font-medium text-blue-600">Rp 300.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total peserta</span>
                    <span className="font-medium">{session.total_bookings} orang</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    disabled={session.ps_status === "full"}
                    asChild={session.ps_status !== "full"}
                  >
                    {session.ps_status === "full" ? (
                      "Sesi Penuh"
                    ) : (
                      <Link href={`/booking?session=${session.ps_id}&date=${session.ps_date}`}>Book Sekarang</Link>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/photographers">Lihat Fotografer</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
