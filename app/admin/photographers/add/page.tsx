"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Save } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function AddPhotographerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    specialty: [] as string[],
    experience: 0,
    pricePerHour: 0,
    location: "",
    status: "active",
    featured: false,
  })

  const specialtyOptions = ["Graduation", "Portrait", "Wedding", "Event", "Family", "Corporate"]

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        specialty: [...prev.specialty, specialty],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        specialty: prev.specialty.filter((s) => s !== specialty),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create new photographer object
      const newPhotographer = {
        id: Math.floor(Math.random() * 1000) + 100,
        ...formData,
        profileImage: "/placeholder.svg?height=200&width=200",
        rating: 0,
        totalBookings: 0,
        joinDate: new Date().toISOString(),
      }

      // Store in localStorage for demo purposes
      const existingPhotographers = JSON.parse(localStorage.getItem("photographers") || "[]")
      localStorage.setItem("photographers", JSON.stringify([...existingPhotographers, newPhotographer]))

      alert("Fotografer berhasil ditambahkan!")
      router.push("/admin/photographers")
    } catch (error) {
      alert("Terjadi kesalahan saat menambahkan fotografer")
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
              <h2 className="text-3xl font-bold text-gray-900">Tambah Fotografer</h2>
              <p className="text-gray-600">Tambahkan fotografer baru ke dalam sistem</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Fotografer</CardTitle>
              <CardDescription>Lengkapi semua informasi yang diperlukan</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="space-y-2">
                  <Label>Foto Profil</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Foto
                    </Button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Studio/Fotografer *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Pengalaman (tahun) *</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: Number.parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerHour">Harga per Jam (Rp) *</Label>
                    <Input
                      id="pricePerHour"
                      type="number"
                      min="0"
                      value={formData.pricePerHour}
                      onChange={(e) => setFormData({ ...formData, pricePerHour: Number.parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio/Deskripsi *</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Deskripsikan pengalaman dan keahlian fotografer..."
                    required
                  />
                </div>

                {/* Specialties */}
                <div className="space-y-2">
                  <Label>Spesialisasi *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {specialtyOptions.map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialty}
                          checked={formData.specialty.includes(specialty)}
                          onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                        />
                        <Label htmlFor={specialty} className="text-sm font-normal">
                          {specialty}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.specialty.length === 0 && (
                    <p className="text-sm text-red-600">Pilih minimal satu spesialisasi</p>
                  )}
                </div>

                {/* Status and Settings */}
                <div className="grid md:grid-cols-2 gap-6">
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
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Pengaturan</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                      />
                      <Label htmlFor="featured" className="text-sm font-normal">
                        Featured Photographer
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-6">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading || formData.specialty.length === 0}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Tambah Fotografer
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <ScrollToTop />
      </RoleBasedLayout>
    </AuthGuard>
  )
}
