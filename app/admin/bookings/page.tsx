"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"

interface Booking {
  id: number
  studentName: string
  studentEmail: string
  photographerName: string
  photographerEmail: string
  sessionName: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  totalPrice: number
  photoSpots: string[]
  specialRequest?: string
  createdAt: string
  paymentStatus: "paid" | "pending" | "refunded"
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Mock data untuk booking
        const mockBookings: Booking[] = [
          {
            id: 1,
            studentName: "Ahmad Rizky Pratama",
            studentEmail: "ahmad.rizky.2021@student.its.ac.id",
            photographerName: "Studio Foto Profesional",
            photographerEmail: "foto.studio1@its.ac.id",
            sessionName: "Sesi Wisuda Pagi - Batch 1",
            date: "2024-06-15",
            startTime: "08:00",
            endTime: "10:00",
            status: "confirmed",
            totalPrice: 350000,
            photoSpots: ["Gedung Rektorat ITS", "Perpustakaan Pusat ITS"],
            specialRequest: "Mohon menyediakan props toga dan topi wisuda",
            createdAt: "2024-06-10T10:30:00Z",
            paymentStatus: "paid",
          },
          {
            id: 2,
            studentName: "Sari Indah Permata",
            studentEmail: "sari.indah.2021@student.its.ac.id",
            photographerName: "Visual Studio Photography",
            photographerEmail: "visual.studio@its.ac.id",
            sessionName: "Sesi Family Portrait",
            date: "2024-06-16",
            startTime: "13:00",
            endTime: "16:00",
            status: "pending",
            totalPrice: 450000,
            photoSpots: ["Taman Teknologi ITS", "Student Center ITS"],
            createdAt: "2024-06-08T14:20:00Z",
            paymentStatus: "pending",
          },
          {
            id: 3,
            studentName: "Budi Santoso",
            studentEmail: "budi.santoso.2021@student.its.ac.id",
            photographerName: "Kenzie Photography",
            photographerEmail: "kenzie.photo@its.ac.id",
            sessionName: "Sesi Individual Portrait",
            date: "2024-06-12",
            startTime: "14:00",
            endTime: "16:00",
            status: "completed",
            totalPrice: 320000,
            photoSpots: ["Perpustakaan Pusat ITS"],
            createdAt: "2024-06-05T09:15:00Z",
            paymentStatus: "paid",
          },
          {
            id: 4,
            studentName: "Diana Putri",
            studentEmail: "diana.putri.2021@student.its.ac.id",
            photographerName: "Studio Foto Profesional",
            photographerEmail: "foto.studio1@its.ac.id",
            sessionName: "Sesi Wisuda Sore - Batch 2",
            date: "2024-06-18",
            startTime: "15:00",
            endTime: "17:00",
            status: "cancelled",
            totalPrice: 350000,
            photoSpots: ["Gedung Rektorat ITS", "Taman Teknologi ITS"],
            createdAt: "2024-06-07T11:45:00Z",
            paymentStatus: "refunded",
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

  const handleDeleteBooking = (id: number) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id))
  }

  const handleUpdateStatus = (id: number, status: "pending" | "confirmed" | "completed" | "cancelled") => {
    setBookings((prev) =>
      prev.map((booking) => {
        if (booking.id === id) {
          return { ...booking, status }
        }
        return booking
      })
    )
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

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Dibayar"
      case "pending":
        return "Menunggu Pembayaran"
      case "refunded":
        return "Dikembalikan"
      default:
        return status
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((booking) => booking.status === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.studentName.toLowerCase().includes(query) ||
          booking.studentEmail.toLowerCase().includes(query) ||
          booking.photographerName.toLowerCase().includes(query) ||
          booking.sessionName.toLowerCase().includes(query) ||
          booking.photoSpots.some((spot) => spot.toLowerCase().includes(query))
      )
    }

    return filtered
  }

  const getTabCount = (tab: string) => {
    if (tab === "all") return bookings.length
    return bookings.filter((booking) => booking.status === tab).length
  }

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data booking...</p>
          </div>
        </div>
      </RoleBasedLayout>
    )
  }

  return (
    <AuthGuard requiredUserType={["admin"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Kelola Booking</h2>
            <p className="text-gray-600">Kelola semua booking dalam sistem ITS Graduation Photo</p>
          </div>

          {/* Search and Add Booking */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Cari booking..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Booking
            </Button>
          </div>

          {/* Booking Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Semua ({getTabCount("all")})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({getTabCount("pending")})</TabsTrigger>
              <TabsTrigger value="confirmed">Dikonfirmasi ({getTabCount("confirmed")})</TabsTrigger>
              <TabsTrigger value="completed">Selesai ({getTabCount("completed")})</TabsTrigger>
              <TabsTrigger value="cancelled">Dibatalkan ({getTabCount("cancelled")})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filterBookings().map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{booking.sessionName}</h3>
                        <p className="text-sm text-gray-600">
                          Booking ID: #{booking.id} • {new Date(booking.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 md:mt-0">
                        <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                          {getPaymentStatusText(booking.paymentStatus)}
                        </Badge>\
