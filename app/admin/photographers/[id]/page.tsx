"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Camera,
  Star,
  DollarSign,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  Edit,
  Ban,
  CheckCircle,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { ScrollToTop } from "@/components/scroll-to-top"

interface PhotographerDetail {
  id: number
  name: string
  email: string
  phone: string
  studioName: string
  specialty: string[]
  pricePerHour: number
  rating: number
  totalReviews: number
  totalBookings: number
  status: "active" | "inactive" | "pending"
  featured: boolean
  registeredDate: string
  lastActive?: string
  profileImage: string
  bio: string
  experience: number
  portfolio: { id: number; title: string; image: string; date: string }[]
  reviews: { id: number; studentName: string; rating: number; comment: string; date: string }[]
  bookings: { id: number; studentName: string; date: string; location: string; status: string; amount: number }[]
  earnings: { month: string; amount: number }[]
}

export default function PhotographerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [photographer, setPhotographer] = useState<PhotographerDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPhotographerDetail = async () => {
      try {
        // Mock data untuk detail fotografer
        const mockPhotographer: PhotographerDetail = {
          id: Number(params.id),
          name: "Studio Foto Profesional",
          email: "foto.studio1@its.ac.id",
          phone: "081234567891",
          studioName: "Studio Foto Profesional",
          specialty: ["Wisuda", "Portrait", "Family"],
          pricePerHour: 150000,
          rating: 4.8,
          totalReviews: 127,
          totalBookings: 156,
          status: "active",
          featured: true,
          registeredDate: "2023-11-20",
          lastActive: "2024-06-09T10:15:00Z",
          profileImage: "/placeholder.svg?height=200&width=200",
          bio: "Studio foto profesional dengan pengalaman lebih dari 5 tahun dalam bidang fotografi wisuda dan portrait. Kami berkomitmen memberikan hasil terbaik untuk momen spesial Anda.",
          experience: 5,
          portfolio: [
            { id: 1, title: "Wisuda ITS 2024", image: "/placeholder.svg?height=300&width=400", date: "2024-05-15" },
            { id: 2, title: "Portrait Session", image: "/placeholder.svg?height=300&width=400", date: "2024-04-20" },
            { id: 3, title: "Family Photo", image: "/placeholder.svg?height=300&width=400", date: "2024-03-10" },
          ],
          reviews: [
            {
              id: 1,
              studentName: "Ahmad Rizki",
              rating: 5,
              comment: "Hasil foto sangat memuaskan, fotografer sangat profesional!",
              date: "2024-06-01",
            },
            {
              id: 2,
              studentName: "Sari Dewi",
              rating: 4,
              comment: "Pelayanan baik, hasil foto bagus sesuai ekspektasi.",
              date: "2024-05-28",
            },
            {
              id: 3,
              studentName: "Budi Santoso",
              rating: 5,
              comment: "Sangat puas dengan hasilnya, akan booking lagi!",
              date: "2024-05-25",
            },
          ],
          bookings: [
            {
              id: 1,
              studentName: "Ahmad Rizki",
              date: "2024-06-15",
              location: "Gedung Rektorat ITS",
              status: "completed",
              amount: 150000,
            },
            {
              id: 2,
              studentName: "Sari Dewi",
              date: "2024-06-20",
              location: "Taman ITS",
              status: "confirmed",
              amount: 150000,
            },
            {
              id: 3,
              studentName: "Budi Santoso",
              date: "2024-06-25",
              location: "Perpustakaan ITS",
              status: "pending",
              amount: 150000,
            },
          ],
          earnings: [
            { month: "Jan 2024", amount: 2400000 },
            { month: "Feb 2024", amount: 3200000 },
            { month: "Mar 2024", amount: 2800000 },
            { month: "Apr 2024", amount: 3600000 },
            { month: "May 2024", amount: 4200000 },
            { month: "Jun 2024", amount: 3800000 },
          ],
        }

        setPhotographer(mockPhotographer)
      } catch (error) {
        console.error("Error fetching photographer detail:", error)
      }
      setLoading(false)
    }

    fetchPhotographerDetail()
  }, [params.id])

  const handleToggleStatus = () => {
    if (photographer) {
      const newStatus = photographer.status === "active" ? "inactive" : "active"
      setPhotographer({ ...photographer, status: newStatus as "active" | "inactive" | "pending" })
    }
  }

  const handleToggleFeatured = () => {
    if (photographer) {
      setPhotographer({ ...photographer, featured: !photographer.featured })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif"
      case "inactive":
        return "Tidak Aktif"
      case "pending":
        return "Menunggu Persetujuan"
      default:
        return status
    }
  }

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat detail fotografer...</p>
          </div>
        </div>
      </RoleBasedLayout>
    )
  }

  if (!photographer) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Fotografer tidak ditemukan</h3>
            <p className="text-gray-500 mb-4">Fotografer yang Anda cari tidak ada atau telah dihapus</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </div>
        </div>
      </RoleBasedLayout>
    )
  }

  return (
    <AuthGuard requiredUserType={["admin"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Detail Fotografer</h2>
                <p className="text-gray-600">Informasi lengkap fotografer {photographer.studioName}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleToggleFeatured}>
                <Star className="h-4 w-4 mr-2" />
                {photographer.featured ? "Hapus dari Unggulan" : "Jadikan Unggulan"}
              </Button>
              <Button variant="outline" onClick={handleToggleStatus}>
                {photographer.status === "active" ? (
                  <>
                    <Ban className="h-4 w-4 mr-2" />
                    Nonaktifkan
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aktifkan
                  </>
                )}
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Photographer Profile */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={photographer.profileImage || "/placeholder.svg"} alt={photographer.name} />
                  <AvatarFallback>{photographer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold">{photographer.studioName}</h1>
                    <Badge className={getStatusColor(photographer.status)}>{getStatusText(photographer.status)}</Badge>
                    {photographer.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Unggulan
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-gray-600 mb-2">{photographer.name}</p>
                  <p className="text-gray-700 mb-4">{photographer.bio}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{photographer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{photographer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{photographer.experience} tahun pengalaman</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Rp {photographer.pricePerHour.toLocaleString("id-ID")}/jam</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-2xl font-bold">{photographer.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">{photographer.totalReviews} ulasan</p>
                  <p className="text-sm text-gray-600">{photographer.totalBookings} booking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="portfolio" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="bookings">Booking</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan</TabsTrigger>
              <TabsTrigger value="earnings">Pendapatan</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                  <CardDescription>Koleksi karya fotografer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photographer.portfolio.map((item) => (
                      <div key={item.id} className="group relative overflow-hidden rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-end">
                          <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <h4 className="font-semibold">{item.title}</h4>
                            <p className="text-sm">{new Date(item.date).toLocaleDateString("id-ID")}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Booking</CardTitle>
                  <CardDescription>Daftar booking fotografer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {photographer.bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold">{booking.studentName}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(booking.date).toLocaleDateString("id-ID")}</span>
                              <MapPin className="h-4 w-4 ml-2" />
                              <span>{booking.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getBookingStatusColor(booking.status)}>
                            {booking.status === "completed"
                              ? "Selesai"
                              : booking.status === "confirmed"
                                ? "Dikonfirmasi"
                                : booking.status === "pending"
                                  ? "Menunggu"
                                  : "Dibatalkan"}
                          </Badge>
                          <span className="font-semibold">Rp {booking.amount.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ulasan Pelanggan</CardTitle>
                  <CardDescription>Feedback dari mahasiswa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {photographer.reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{review.studentName}</h4>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString("id-ID")}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pendapatan</CardTitle>
                  <CardDescription>Riwayat pendapatan bulanan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {photographer.earnings.map((earning, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <TrendingUp className="h-8 w-8 text-green-500" />
                          <div>
                            <h4 className="font-semibold">{earning.month}</h4>
                            <p className="text-sm text-gray-600">Pendapatan bulanan</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-green-600">
                          Rp {earning.amount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <ScrollToTop />
      </RoleBasedLayout>
    </AuthGuard>
  )
}
