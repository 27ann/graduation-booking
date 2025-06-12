"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus, Edit, Trash2, Search, Filter, Star } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"

interface PhotoSpot {
  id: number
  name: string
  description: string
  location: string
  capacity: number
  pricePerHour: number
  facilities: string[]
  status: "active" | "inactive" | "maintenance"
  rating: number
  totalBookings: number
  createdAt: string
}

export default function AdminPhotoSpotsPage() {
  const [photoSpots, setPhotoSpots] = useState<PhotoSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSpot, setEditingSpot] = useState<PhotoSpot | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    capacity: "",
    pricePerHour: "",
    facilities: "",
    status: "active",
  })

  useEffect(() => {
    fetchPhotoSpots()
  }, [])

  const fetchPhotoSpots = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockData: PhotoSpot[] = [
        {
          id: 1,
          name: "Taman Kampus ITS",
          description: "Area terbuka hijau dengan pemandangan indah",
          location: "Kampus ITS Sukolilo",
          capacity: 20,
          pricePerHour: 50000,
          facilities: ["Gazebo", "Taman", "Bangku", "Pencahayaan"],
          status: "active",
          rating: 4.5,
          totalBookings: 45,
          createdAt: "2024-01-15",
        },
        {
          id: 2,
          name: "Gedung Rektorat",
          description: "Lokasi formal dengan arsitektur modern",
          location: "Gedung Rektorat ITS",
          capacity: 15,
          pricePerHour: 75000,
          facilities: ["AC", "Pencahayaan Studio", "Backdrop"],
          status: "active",
          rating: 4.8,
          totalBookings: 32,
          createdAt: "2024-01-10",
        },
        {
          id: 3,
          name: "Perpustakaan Pusat",
          description: "Area indoor dengan suasana akademik",
          location: "Perpustakaan ITS",
          capacity: 10,
          pricePerHour: 60000,
          facilities: ["AC", "Meja", "Kursi", "Buku"],
          status: "maintenance",
          rating: 4.2,
          totalBookings: 28,
          createdAt: "2024-01-05",
        },
      ]

      setPhotoSpots(mockData)
    } catch (error) {
      console.error("Error fetching photo spots:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const spotData = {
        ...formData,
        capacity: Number.parseInt(formData.capacity),
        pricePerHour: Number.parseInt(formData.pricePerHour),
        facilities: formData.facilities.split(",").map((f) => f.trim()),
      }

      if (editingSpot) {
        // Update existing spot
        setPhotoSpots((prev) => prev.map((spot) => (spot.id === editingSpot.id ? { ...spot, ...spotData } : spot)))
      } else {
        // Add new spot
        const newSpot: PhotoSpot = {
          id: Date.now(),
          ...spotData,
          rating: 0,
          totalBookings: 0,
          createdAt: new Date().toISOString().split("T")[0],
        }
        setPhotoSpots((prev) => [newSpot, ...prev])
      }

      resetForm()
      setIsAddDialogOpen(false)
      setEditingSpot(null)
    } catch (error) {
      console.error("Error saving photo spot:", error)
    }
  }

  const handleEdit = (spot: PhotoSpot) => {
    setEditingSpot(spot)
    setFormData({
      name: spot.name,
      description: spot.description,
      location: spot.location,
      capacity: spot.capacity.toString(),
      pricePerHour: spot.pricePerHour.toString(),
      facilities: spot.facilities.join(", "),
      status: spot.status,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus lokasi foto ini?")) {
      setPhotoSpots((prev) => prev.filter((spot) => spot.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      capacity: "",
      pricePerHour: "",
      facilities: "",
      status: "active",
    })
  }

  const filteredSpots = photoSpots.filter((spot) => {
    const matchesSearch =
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || spot.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "maintenance":
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
      case "maintenance":
        return "Maintenance"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <AuthGuard requiredUserType="admin">
        <RoleBasedLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Memuat data lokasi foto...</p>
            </div>
          </div>
        </RoleBasedLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredUserType="admin">
      <RoleBasedLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kelola Lokasi Foto</h1>
              <p className="text-gray-600">Kelola semua lokasi foto yang tersedia</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    resetForm()
                    setEditingSpot(null)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Lokasi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingSpot ? "Edit Lokasi Foto" : "Tambah Lokasi Foto"}</DialogTitle>
                  <DialogDescription>
                    {editingSpot ? "Edit informasi lokasi foto" : "Tambahkan lokasi foto baru ke sistem"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Lokasi</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Alamat</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="capacity">Kapasitas</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pricePerHour">Harga per Jam</Label>
                      <Input
                        id="pricePerHour"
                        type="number"
                        value={formData.pricePerHour}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pricePerHour: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Tidak Aktif</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="facilities">Fasilitas (pisahkan dengan koma)</Label>
                    <Input
                      id="facilities"
                      value={formData.facilities}
                      onChange={(e) => setFormData((prev) => ({ ...prev, facilities: e.target.value }))}
                      placeholder="AC, Pencahayaan, Backdrop, dll"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit">{editingSpot ? "Update" : "Tambah"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari lokasi foto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Spots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => (
              <Card key={spot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{spot.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {spot.location}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(spot.status)}>{getStatusText(spot.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{spot.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Kapasitas:</span>
                      <span className="font-medium">{spot.capacity} orang</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Harga:</span>
                      <span className="font-medium">Rp {spot.pricePerHour.toLocaleString()}/jam</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rating:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{spot.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Booking:</span>
                      <span className="font-medium">{spot.totalBookings}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Fasilitas:</p>
                    <div className="flex flex-wrap gap-1">
                      {spot.facilities.map((facility, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(spot)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(spot.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSpots.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada lokasi foto</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Tidak ada lokasi yang sesuai dengan filter"
                    : "Belum ada lokasi foto yang ditambahkan"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
