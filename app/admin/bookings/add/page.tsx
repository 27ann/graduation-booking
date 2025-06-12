"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Calendar, Camera, MapPin } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function AddBookingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photographers, setPhotographers] = useState([])
  const [photoSpots, setPhotoSpots] = useState([])
  const [users, setUsers] = useState([])
  const [sessions, setSessions] = useState([])

  const [formData, setFormData] = useState({
    userId: "",
    photographerId: "",
    photoSessionId: "",
    date: "",
    startTime: "09:00",
    endTime: "12:00",
    specialRequest: "",
    selectedSpots: [] as number[],
    status: "pending",
    totalPrice: 0,
  })

  useEffect(() => {
    // Mock data
    setPhotographers([
      { id: 1, name: "Studio Foto Kenzie", pricePerHour: 150000 },
      { id: 2, name: "Visual Art Studio", pricePerHour: 200000 },
      { id: 3, name: "Moment Capture", pricePerHour: 120000 },
      { id: 4, name: "ITS Photo Pro", pricePerHour: 180000 },
      { id: 5, name: "Campus Memory", pricePerHour: 130000 },
    ])

    setPhotoSpots([
      { id: 1, name: "Gedung Rektorat ITS", price: 50000 },
      { id: 2, name: "Perpustakaan Pusat ITS", price: 40000 },
      { id: 3, name: "Taman Teknologi ITS", price: 30000 },
      { id: 4, name: "Student Center ITS", price: 35000 },
      { id: 5, name: "Graha ITS", price: 80000 },
    ])

    setUsers([
      { id: 1, name: "Ahmad Rizky Pratama", email: "ahmad.rizky@student.its.ac.id" },
      { id: 2, name: "Sari Indah Permata", email: "sari.indah@student.its.ac.id" },
      { id: 3, name: "Budi Santoso", email: "budi.santoso@student.its.ac.id" },
      { id: 4, name: "Maya Sari", email: "maya.sari@student.its.ac.id" },
      { id: 5, name: "Andi Wijaya", email: "andi.wijaya@student.its.ac.id" },
    ])

    setSessions([
      { id: 1, name: "Sesi Wisuda Pagi - Batch 1", date: "2024-06-15", startTime: "08:00", endTime: "10:00" },
      { id: 2, name: "Sesi Wisuda Siang - Batch 1", date: "2024-06-15", startTime: "13:00", endTime: "15:00" },
      { id: 3, name: "Sesi Wisuda Sore - Batch 1", date: "2024-06-15", startTime: "16:00", endTime: "18:00" },
      { id: 4, name: "Sesi Wisuda Pagi - Batch 2", date: "2024-06-16", startTime: "08:00", endTime: "10:00" },
      { id: 5, name: "Sesi Wisuda Siang - Batch 2", date: "2024-06-16", startTime: "13:00", endTime: "15:00" },
    ])
  }, [])

  useEffect(() => {
    calculateTotalPrice()
  }, [formData.photographerId, formData.startTime, formData.endTime, formData.selectedSpots])

  const calculateTotalPrice = () => {
    const photographer = photographers.find((p: any) => p.id === Number.parseInt(formData.photographerId))
    if (!photographer) return

    const startTime = new Date(`2024-01-01 ${formData.startTime}:00`)
    const endTime = new Date(`2024-01-01 ${formData.endTime}:00`)
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) // hours

    const photographerCost = (photographer as any).pricePerHour * duration
    const spotsCost = formData.selectedSpots.reduce((total, spotId) => {
      const spot = photoSpots.find((s: any) => s.id === spotId)
      return total + (spot ? (spot as any).price : 0)
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
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create new booking object
      const newBooking = {
        id: Math.floor(Math.random() * 1000) + 100,
        ...formData,
        userId: Number.parseInt(formData.userId),
        photographerId: Number.parseInt(formData.photographerId),
        photoSessionId: Number.parseInt(formData.photoSessionId),
        createdAt: new Date().toISOString(),
      }

      // Store in localStorage for demo purposes
      const existingBookings = JSON.parse(localStorage.getItem("adminBookings") || "[]")
      localStorage.setItem("adminBookings", JSON.stringify([...existingBookings, newBooking]))

      alert("Booking berhasil ditambahkan!")
      router.push("/admin/bookings")
    } catch (error) {
      alert("Terjadi kesalahan saat menambahkan booking")
    }
    setLoading(false)
  }

  return (
    <AuthGuard requiredUserType={["admin"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Tambah Booking</h2>
              <p className="text-gray-600">Buat booking baru untuk mahasiswa</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Booking</CardTitle>
                  <CardDescription>Lengkapi informasi booking</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="user">Pilih Mahasiswa *</Label>
                      <Select
                        value={formData.userId}
                        onValueChange={(value) => setFormData({ ...formData, userId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih mahasiswa" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name} - {user.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Photographer Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="photographer">Pilih Fotografer *</Label>
                      <Select
                        value={formData.photographerId}
                        onValueChange={(value) => setFormData({ ...formData, photographerId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih fotografer" />
                        </SelectTrigger>
                        <SelectContent>
                          {photographers.map((photographer: any) => (
                            <SelectItem key={photographer.id} value={photographer.id.toString()}>
                              {photographer.name} - Rp {photographer.pricePerHour.toLocaleString("id-ID")}/jam
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Photo Session Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="session">Pilih Sesi Foto *</Label>
                      <Select
                        value={formData.photoSessionId}
                        onValueChange={(value) => setFormData({ ...formData, photoSessionId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih sesi foto" />
                        </SelectTrigger>
                        <SelectContent>
                          {sessions.map((session: any) => (
                            <SelectItem key={session.id} value={session.id.toString()}>
                              {session.name} ({session.date} {session.startTime}-{session.endTime})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date and Time */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Tanggal *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Waktu Mulai *</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">Waktu Selesai *</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Photo Spots Selection */}
                    <div className="space-y-2">
                      <Label>Pilih Lokasi Foto *</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {photoSpots.map((spot: any) => (
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
                              <p className="text-xs text-gray-500">Rp {spot.price.toLocaleString("id-ID")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {formData.selectedSpots.length === 0 && (
                        <p className="text-sm text-red-600">Pilih minimal satu lokasi foto</p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Special Request */}
                    <div className="space-y-2">
                      <Label htmlFor="specialRequest">Permintaan Khusus (Opsional)</Label>
                      <Textarea
                        id="specialRequest"
                        placeholder="Contoh: Mohon menyediakan props toga dan topi wisuda..."
                        value={formData.specialRequest}
                        onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-4 pt-6">
                      <Button type="button" variant="outline" onClick={() => router.back()}>
                        Batal
                      </Button>
                      <Button type="submit" disabled={loading || formData.selectedSpots.length === 0}>
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Buat Booking
                          </>
                        )}
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
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.photographerId && (
                    <div className="flex items-center space-x-3">
                      <Camera className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">
                          {photographers.find((p: any) => p.id === Number.parseInt(formData.photographerId))?.name}
                        </p>
                        <p className="text-sm text-gray-600">Fotografer</p>
                      </div>
                    </div>
                  )}

                  {formData.date && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{new Date(formData.date).toLocaleDateString("id-ID")}</p>
                        <p className="text-sm text-gray-600">
                          {formData.startTime} - {formData.endTime}
                        </p>
                      </div>
                    </div>
                  )}

                  {formData.selectedSpots.length > 0 && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Lokasi Foto</p>
                        <ul className="text-sm text-gray-600">
                          {formData.selectedSpots.map((spotId) => {
                            const spot = photoSpots.find((s: any) => s.id === spotId)
                            return spot && <li key={spot.id}>{(spot as any).name}</li>
                          })}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Biaya</span>
                      <span className="text-lg font-bold text-blue-600">
                        Rp {formData.totalPrice.toLocaleString("id-ID")}
                      </span>
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
