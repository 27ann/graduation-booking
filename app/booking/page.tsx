"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Camera, Calendar, Clock, MapPin, DollarSign, ArrowLeft } from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { ScrollToTop } from "@/components/scroll-to-top"
import { toast } from "@/components/ui/use-toast"

export default function BookingPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const photographerId = searchParams.get("photographer")
  const spotId = searchParams.get("spot")
  const sessionId = searchParams.get("session")
  const initialDate = searchParams.get("date") || new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    userId: user?.id || 1,
    photographerId: photographerId ? Number.parseInt(photographerId) : 1,
    photoSessionId: sessionId ? Number.parseInt(sessionId) : 1,
    date: initialDate,
    startTime: "08:00",
    endTime: "10:00",
    specialRequest: "",
    selectedSpots: spotId ? [Number.parseInt(spotId)] : [],
  })

  const [photoSpots, setPhotoSpots] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)

  // Mock data - hanya nama sesi tanpa tanggal dan jam
  const photographers = [
    { id: 1, name: "Studio Foto Kenzie", pricePerHour: 150000, specialty: "Graduation & Portrait" },
    { id: 2, name: "Visual Art Studio", pricePerHour: 200000, specialty: "Wedding & Graduation" },
    { id: 3, name: "Moment Capture", pricePerHour: 120000, specialty: "Event & Portrait" },
    { id: 4, name: "ITS Photo Pro", pricePerHour: 180000, specialty: "Professional Portrait" },
    { id: 5, name: "Campus Memory", pricePerHour: 130000, specialty: "Graduation & Campus Life" },
  ]

  // Sesi foto tanpa tanggal dan jam - hanya nama dan deskripsi
  const photoSessions = [
    {
      id: 1,
      name: "Sesi Wisuda Pagi",
      description: "Sesi foto wisuda dengan pencahayaan natural pagi hari",
      category: "wisuda",
      defaultDuration: 2, // jam
    },
    {
      id: 2,
      name: "Sesi Wisuda Siang",
      description: "Sesi foto wisuda di waktu siang yang ideal",
      category: "wisuda",
      defaultDuration: 2,
    },
    {
      id: 3,
      name: "Sesi Wisuda Sore",
      description: "Sesi foto wisuda dengan suasana golden hour",
      category: "wisuda",
      defaultDuration: 2,
    },
    {
      id: 4,
      name: "Sesi Pre-Graduation",
      description: "Sesi foto persiapan sebelum wisuda",
      category: "pre-graduation",
      defaultDuration: 3,
    },
    {
      id: 5,
      name: "Sesi Group Photo",
      description: "Sesi foto group untuk organisasi atau jurusan",
      category: "group",
      defaultDuration: 3,
    },
    {
      id: 6,
      name: "Sesi Individual Portrait",
      description: "Sesi foto individual dengan berbagai pose",
      category: "individual",
      defaultDuration: 3,
    },
    {
      id: 7,
      name: "Sesi Family Portrait",
      description: "Sesi foto keluarga untuk momen wisuda",
      category: "family",
      defaultDuration: 3,
    },
    {
      id: 8,
      name: "Sesi Professional Headshot",
      description: "Sesi foto professional untuk keperluan karir",
      category: "professional",
      defaultDuration: 3,
    },
  ]

  const mockPhotoSpots = [
    { id: 1, name: "Gedung Rektorat ITS", price: 50000, location: "Jl. Arief Rahman Hakim, Sukolilo" },
    { id: 2, name: "Perpustakaan Pusat ITS", price: 40000, location: "Kampus ITS Sukolilo" },
    { id: 3, name: "Taman Teknologi ITS", price: 30000, location: "Area Tengah Kampus ITS" },
    { id: 4, name: "Student Center ITS", price: 35000, location: "Area Tengah Kampus" },
    { id: 5, name: "Graha ITS", price: 80000, location: "Kampus ITS Sukolilo" },
  ]

  useEffect(() => {
    setPhotoSpots(mockPhotoSpots)
  }, [])

  useEffect(() => {
    calculateTotalPrice()
  }, [formData])

  // Auto-set end time based on session duration
  useEffect(() => {
    const selectedSession = photoSessions.find((s) => s.id === formData.photoSessionId)
    if (selectedSession && formData.startTime) {
      const startTime = new Date(`2024-01-01 ${formData.startTime}:00`)
      const endTime = new Date(startTime.getTime() + selectedSession.defaultDuration * 60 * 60 * 1000)
      const endTimeString = endTime.toTimeString().slice(0, 5)

      setFormData((prev) => ({
        ...prev,
        endTime: endTimeString,
      }))
    }
  }, [formData.photoSessionId, formData.startTime])

  const calculateTotalPrice = () => {
    const photographer = photographers.find((p) => p.id === formData.photographerId)
    if (!photographer) return

    const startTime = new Date(`2024-01-01 ${formData.startTime}:00`)
    const endTime = new Date(`2024-01-01 ${formData.endTime}:00`)
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) // hours

    const photographerCost = photographer.pricePerHour * duration
    const spotsCost = formData.selectedSpots.reduce((total, spotId) => {
      const spot = mockPhotoSpots.find((s) => s.id === spotId)
      return total + (spot ? spot.price : 0)
    }, 0)

    setTotalPrice(photographerCost + spotsCost)
  }

  const handleSpotToggle = (spotId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedSpots: prev.selectedSpots.includes(spotId)
        ? prev.selectedSpots.filter((id) => id !== spotId)
        : [...prev.selectedSpots, spotId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi form
    if (formData.selectedSpots.length === 0) {
      toast({
        title: "Error",
        description: "Pilih minimal satu lokasi foto",
        variant: "destructive",
      })
      return
    }

    if (!formData.date) {
      toast({
        title: "Error",
        description: "Pilih tanggal foto",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate booking creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Get photographer and session details
      const photographer = photographers.find((p) => p.id === formData.photographerId)
      const session = photoSessions.find((s) => s.id === formData.photoSessionId)
      const spots = formData.selectedSpots.map((spotId) => mockPhotoSpots.find((s) => s.id === spotId)).filter(Boolean)

      // Create a new booking object
      const newBooking = {
        id: Math.floor(Math.random() * 1000) + 100,
        photographerName: photographer?.name || "Unknown",
        photographerPhone: "082111222333", // Mock phone
        sessionName: session?.name || "Unknown Session",
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: "pending",
        totalPrice: totalPrice,
        photoSpots: spots.map((spot) => ({
          id: spot.id,
          name: spot.name,
          price: spot.price,
        })),
        specialRequest: formData.specialRequest,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        photographerId: formData.photographerId,
        sessionId: formData.photoSessionId,
      }

      // Store in localStorage for demo purposes
      const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]")
      localStorage.setItem("userBookings", JSON.stringify([...existingBookings, newBooking]))

      // Show success message
      toast({
        title: "Booking Berhasil!",
        description: "Booking foto wisuda Anda telah berhasil dibuat",
      })

      // Redirect to my-bookings immediately
      setTimeout(() => {
        router.push("/my-bookings")
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat booking",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const selectedPhotographer = photographers.find((p) => p.id === formData.photographerId)
  const selectedSession = photoSessions.find((s) => s.id === formData.photoSessionId)

  return (
    <AuthGuard requiredUserType={["student"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Buat Booking Foto Wisuda</h2>
              <p className="text-gray-600">Lengkapi form di bawah untuk membuat booking foto wisuda Anda</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Booking</CardTitle>
                  <CardDescription>Isi informasi booking sesuai kebutuhan Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photographer Selection */}
                    <div>
                      <Label htmlFor="photographer">Pilih Fotografer</Label>
                      <Select
                        value={formData.photographerId.toString()}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, photographerId: Number.parseInt(value) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {photographers.map((photographer) => (
                            <SelectItem key={photographer.id} value={photographer.id.toString()}>
                              {photographer.name} - Rp {photographer.pricePerHour.toLocaleString("id-ID")}/jam
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Photo Session Selection - Hanya nama sesi */}
                    <div>
                      <Label htmlFor="session">Pilih Sesi Foto</Label>
                      <Select
                        value={formData.photoSessionId.toString()}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, photoSessionId: Number.parseInt(value) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {photoSessions.map((session) => (
                            <SelectItem key={session.id} value={session.id.toString()}>
                              {session.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedSession && <p className="text-sm text-gray-600 mt-1">{selectedSession.description}</p>}
                    </div>

                    {/* Date and Time - Input terpisah */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="date">Tanggal</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime">Waktu Mulai</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">Waktu Selesai</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                          required
                        />
                        {selectedSession && (
                          <p className="text-xs text-gray-500 mt-1">
                            Durasi rekomendasi: {selectedSession.defaultDuration} jam
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Photo Spots Selection */}
                    <div>
                      <Label className="text-base font-medium mb-4 block">Pilih Lokasi Foto</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {photoSpots.map((spot) => (
                          <div key={spot.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                            <Checkbox
                              id={`spot-${spot.id}`}
                              checked={formData.selectedSpots.includes(spot.id)}
                              onCheckedChange={() => handleSpotToggle(spot.id)}
                            />
                            <div className="flex-1">
                              <label htmlFor={`spot-${spot.id}`} className="text-sm font-medium cursor-pointer">
                                {spot.name}
                              </label>
                              <p className="text-xs text-gray-500">
                                Rp {spot.price.toLocaleString("id-ID")} - {spot.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Request */}
                    <div>
                      <Label htmlFor="specialRequest">Permintaan Khusus (Opsional)</Label>
                      <Textarea
                        id="specialRequest"
                        placeholder="Contoh: Mohon menyediakan props toga dan topi wisuda..."
                        value={formData.specialRequest}
                        onChange={(e) => setFormData((prev) => ({ ...prev, specialRequest: e.target.value }))}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Memproses..." : "Buat Booking"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Ringkasan Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPhotographer && (
                    <div className="flex items-center space-x-3">
                      <Camera className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{selectedPhotographer.name}</p>
                        <p className="text-sm text-gray-600">
                          Rp {selectedPhotographer.pricePerHour.toLocaleString("id-ID")}/jam
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedSession && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{selectedSession.name}</p>
                        <p className="text-sm text-gray-600">{selectedSession.description}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Jadwal</p>
                      <p className="text-sm text-gray-600">
                        {formData.date ? new Date(formData.date).toLocaleDateString("id-ID") : "Belum dipilih"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formData.startTime} - {formData.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Lokasi Foto</p>
                      {formData.selectedSpots.length > 0 ? (
                        <ul className="text-sm text-gray-600 list-disc pl-6">
                          {formData.selectedSpots.map((spotId) => {
                            const spot = mockPhotoSpots.find((s) => s.id === spotId)
                            return spot && <li key={spot.id}>{spot.name}</li>
                          })}
                        </ul>
                      ) : (
                        <p className="text-sm text-red-500">Belum ada lokasi yang dipilih</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Total Biaya</p>
                      <p className="text-lg font-bold text-blue-600">Rp {totalPrice.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <ScrollToTop />
      </RoleBasedLayout>
    </AuthGuard>
  )
}
