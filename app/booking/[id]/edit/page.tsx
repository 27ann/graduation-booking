"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, DollarSign, ArrowLeft, Save } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import Link from "next/link"

interface EditBookingData {
  id: number
  photographerId: number
  photoSessionId: number
  date: string
  startTime: string
  endTime: string
  specialRequest: string
  selectedSpots: number[]
  totalPrice: number
}

interface PhotoSpot {
  id: number
  name: string
  price: number
  location: string
}

interface Photographer {
  id: number
  name: string
  pricePerHour: number
  specialty: string
}

interface PhotoSession {
  id: number
  name: string
  date: string
  startTime: string
  endTime: string
}

export default function EditBookingPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id

  const [formData, setFormData] = useState<EditBookingData>({
    id: 0,
    photographerId: 1,
    photoSessionId: 1,
    date: "2024-06-15",
    startTime: "08:00",
    endTime: "10:00",
    specialRequest: "",
    selectedSpots: [],
    totalPrice: 0,
  })

  const [originalData, setOriginalData] = useState<EditBookingData | null>(null)
  const [photoSpots, setPhotoSpots] = useState<PhotoSpot[]>([])
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [photoSessions, setPhotoSessions] = useState<PhotoSession[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Mock data
  const mockPhotographers: Photographer[] = [
    { id: 1, name: "Studio Foto Kenzie", pricePerHour: 150000, specialty: "Graduation & Portrait" },
    { id: 2, name: "Visual Art Studio", pricePerHour: 200000, specialty: "Wedding & Graduation" },
    { id: 3, name: "Moment Capture", pricePerHour: 120000, specialty: "Event & Portrait" },
    { id: 4, name: "ITS Photo Pro", pricePerHour: 180000, specialty: "Professional Portrait" },
    { id: 5, name: "Campus Memory", pricePerHour: 130000, specialty: "Graduation & Campus Life" },
  ]

  const mockPhotoSessions: PhotoSession[] = [
    { id: 1, name: "Sesi Wisuda Pagi - Batch 1", date: "2024-06-15", startTime: "08:00", endTime: "10:00" },
    { id: 2, name: "Sesi Wisuda Siang - Batch 1", date: "2024-06-15", startTime: "13:00", endTime: "15:00" },
    { id: 3, name: "Sesi Wisuda Sore - Batch 1", date: "2024-06-15", startTime: "16:00", endTime: "18:00" },
    { id: 4, name: "Sesi Wisuda Pagi - Batch 2", date: "2024-06-16", startTime: "08:00", endTime: "10:00" },
    { id: 5, name: "Sesi Wisuda Siang - Batch 2", date: "2024-06-16", startTime: "13:00", endTime: "15:00" },
  ]

  const mockPhotoSpots: PhotoSpot[] = [
    { id: 1, name: "Gedung Rektorat ITS", price: 50000, location: "Jl. Arief Rahman Hakim, Sukolilo" },
    { id: 2, name: "Perpustakaan Pusat ITS", price: 40000, location: "Kampus ITS Sukolilo" },
    { id: 3, name: "Taman Teknologi ITS", price: 30000, location: "Area Tengah Kampus ITS" },
    { id: 4, name: "Student Center ITS", price: 35000, location: "Area Tengah Kampus" },
    { id: 5, name: "Graha ITS", price: 80000, location: "Kampus ITS Sukolilo" },
  ]

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        // Mock existing booking data
        const existingBooking: EditBookingData = {
          id: Number(bookingId),
          photographerId: 1,
          photoSessionId: 1,
          date: "2024-06-15",
          startTime: "08:00",
          endTime: "10:00",
          specialRequest: "Mohon menyediakan props toga dan topi wisuda",
          selectedSpots: [1, 2],
          totalPrice: 350000,
        }

        setFormData(existingBooking)
        setOriginalData(existingBooking)
        setPhotographers(mockPhotographers)
        setPhotoSessions(mockPhotoSessions)
        setPhotoSpots(mockPhotoSpots)
      } catch (error) {
        console.error("Error fetching booking data:", error)
      }
      setLoading(false)
    }

    fetchBookingData()
  }, [bookingId])

  useEffect(() => {
    calculateTotalPrice()
  }, [formData.photographerId, formData.startTime, formData.endTime, formData.selectedSpots])

  const calculateTotalPrice = () => {
    const photographer = photographers.find((p) => p.id === formData.photographerId)
    if (!photographer) return

    const startTime = new Date(`2024-01-01 ${formData.startTime}:00`)
    const endTime = new Date(`2024-01-01 ${formData.endTime}:00`)
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) // hours

    const photographerCost = photographer.pricePerHour * duration
    const spotsCost = formData.selectedSpots.reduce((total, spotId) => {
      const spot = photoSpots.find((s) => s.id === spotId)
      return total + (spot ? spot.price : 0)
    }, 0)

    setFormData((prev) => ({ ...prev, totalPrice: photographerCost + spotsCost }))
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
    setSaving(true)

    try {
      // Mock update booking
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("Booking berhasil diupdate!")
      router.push(`/booking/${bookingId}`)
    } catch (error) {
      alert("Terjadi kesalahan saat mengupdate booking")
    }
    setSaving(false)
  }

  const hasChanges = () => {
    if (!originalData) return false
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }

  const selectedPhotographer = photographers.find((p) => p.id === formData.photographerId)
  const selectedSession = photoSessions.find((s) => s.id === formData.photoSessionId)

  if (loading) {
    return (
      <AuthGuard requiredUserType={["student"]}>
        <RoleBasedLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data booking...</p>
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
            <Link href={`/booking/${bookingId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Detail Booking
            </Link>
          </Button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Booking</h2>
            <p className="text-gray-600">Edit detail booking #{bookingId?.toString().padStart(5, "0")}</p>
            {!hasChanges() && (
              <div className="mt-2">
                <Badge variant="outline">Belum ada perubahan</Badge>
              </div>
            )}
            {hasChanges() && (
              <div className="mt-2">
                <Badge className="bg-yellow-100 text-yellow-800">Ada perubahan yang belum disimpan</Badge>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Edit Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Detail Booking</CardTitle>
                  <CardDescription>
                    Ubah detail booking sesuai kebutuhan Anda. Perubahan akan memerlukan konfirmasi ulang dari
                    fotografer.
                  </CardDescription>
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

                    {/* Photo Session Selection */}
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
                              {session.name} ({session.date} {session.startTime}-{session.endTime})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date and Time */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="date">Tanggal</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime">Waktu Mulai</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">Waktu Selesai</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                        />
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
                      <Label htmlFor="specialRequest">Permintaan Khusus</Label>
                      <Textarea
                        id="specialRequest"
                        placeholder="Contoh: Mohon menyediakan props toga dan topi wisuda..."
                        value={formData.specialRequest}
                        onChange={(e) => setFormData((prev) => ({ ...prev, specialRequest: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" disabled={saving || !hasChanges()} className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/booking/${bookingId}`)}
                        className="flex-1"
                      >
                        Batal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Ringkasan Booking</CardTitle>
                  <CardDescription>Preview perubahan booking Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPhotographer && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
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
                        <p className="text-sm text-gray-600">
                          {formData.date} {formData.startTime}-{formData.endTime}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Durasi</p>
                      <p className="text-sm text-gray-600">
                        {(() => {
                          const start = new Date(`2024-01-01 ${formData.startTime}:00`)
                          const end = new Date(`2024-01-01 ${formData.endTime}:00`)
                          const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                          return `${duration} jam`
                        })()}
                      </p>
                    </div>
                  </div>

                  {formData.selectedSpots.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Lokasi Foto</p>
                        <ul className="text-sm text-gray-600">
                          {formData.selectedSpots.map((spotId) => {
                            const spot = photoSpots.find((s) => s.id === spotId)
                            return (
                              spot && (
                                <li key={spot.id} className="flex justify-between">
                                  <span>{spot.name}</span>
                                  <span>Rp {spot.price.toLocaleString("id-ID")}</span>
                                </li>
                              )
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">Total Biaya</p>
                        <p className="text-lg font-bold text-blue-600">
                          Rp {formData.totalPrice.toLocaleString("id-ID")}
                        </p>
                        {originalData && formData.totalPrice !== originalData.totalPrice && (
                          <p className="text-sm text-gray-500">
                            Sebelumnya: Rp {originalData.totalPrice.toLocaleString("id-ID")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {hasChanges() && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Perhatian:</strong> Perubahan booking akan memerlukan konfirmasi ulang dari fotografer.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
