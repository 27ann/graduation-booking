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
import { Calendar, Plus, Edit, Trash2, Search, Filter, Clock, MapPin, Camera, Users } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"

interface Session {
  id: number
  title: string
  description: string
  photographerId: number
  photographerName: string
  locationId: number
  locationName: string
  date: string
  startTime: string
  endTime: string
  maxParticipants: number
  currentParticipants: number
  price: number
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
  createdAt: string
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photographerId: "",
    locationId: "",
    date: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    price: "",
    status: "scheduled",
  })

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockData: Session[] = [
        {
          id: 1,
          title: "Sesi Foto Wisuda Batch 1",
          description: "Sesi foto wisuda untuk mahasiswa teknik",
          photographerId: 1,
          photographerName: "Ahmad Rizki",
          locationId: 1,
          locationName: "Taman Kampus ITS",
          date: "2024-12-20",
          startTime: "09:00",
          endTime: "12:00",
          maxParticipants: 20,
          currentParticipants: 15,
          price: 150000,
          status: "scheduled",
          createdAt: "2024-12-01",
        },
        {
          id: 2,
          title: "Sesi Foto Wisuda Batch 2",
          description: "Sesi foto wisuda untuk mahasiswa sains",
          photographerId: 2,
          photographerName: "Sari Indah",
          locationId: 2,
          locationName: "Gedung Rektorat",
          date: "2024-12-21",
          startTime: "13:00",
          endTime: "16:00",
          maxParticipants: 15,
          currentParticipants: 12,
          price: 200000,
          status: "scheduled",
          createdAt: "2024-12-01",
        },
        {
          id: 3,
          title: "Sesi Foto Individual",
          description: "Sesi foto individual premium",
          photographerId: 1,
          photographerName: "Ahmad Rizki",
          locationId: 3,
          locationName: "Perpustakaan Pusat",
          date: "2024-12-15",
          startTime: "10:00",
          endTime: "11:00",
          maxParticipants: 1,
          currentParticipants: 1,
          price: 300000,
          status: "completed",
          createdAt: "2024-11-25",
        },
      ]

      setSessions(mockData)
    } catch (error) {
      console.error("Error fetching sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const sessionData = {
        ...formData,
        photographerId: Number.parseInt(formData.photographerId),
        locationId: Number.parseInt(formData.locationId),
        maxParticipants: Number.parseInt(formData.maxParticipants),
        price: Number.parseInt(formData.price),
      }

      if (editingSession) {
        // Update existing session
        setSessions((prev) =>
          prev.map((session) =>
            session.id === editingSession.id
              ? {
                  ...session,
                  ...sessionData,
                  photographerName: "Ahmad Rizki", // Mock data
                  locationName: "Taman Kampus ITS", // Mock data
                }
              : session,
          ),
        )
      } else {
        // Add new session
        const newSession: Session = {
          id: Date.now(),
          ...sessionData,
          photographerName: "Ahmad Rizki", // Mock data
          locationName: "Taman Kampus ITS", // Mock data
          currentParticipants: 0,
          createdAt: new Date().toISOString().split("T")[0],
        }
        setSessions((prev) => [newSession, ...prev])
      }

      resetForm()
      setIsAddDialogOpen(false)
      setEditingSession(null)
    } catch (error) {
      console.error("Error saving session:", error)
    }
  }

  const handleEdit = (session: Session) => {
    setEditingSession(session)
    setFormData({
      title: session.title,
      description: session.description,
      photographerId: session.photographerId.toString(),
      locationId: session.locationId.toString(),
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      maxParticipants: session.maxParticipants.toString(),
      price: session.price.toString(),
      status: session.status,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus sesi ini?")) {
      setSessions((prev) => prev.filter((session) => session.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      photographerId: "",
      locationId: "",
      date: "",
      startTime: "",
      endTime: "",
      maxParticipants: "",
      price: "",
      status: "scheduled",
    })
  }

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.photographerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.locationName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || session.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Terjadwal"
      case "ongoing":
        return "Berlangsung"
      case "completed":
        return "Selesai"
      case "cancelled":
        return "Dibatalkan"
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
              <p className="mt-2 text-gray-600">Memuat data sesi...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Kelola Sesi Foto</h1>
              <p className="text-gray-600">Kelola semua sesi foto yang tersedia</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    resetForm()
                    setEditingSession(null)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Sesi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingSession ? "Edit Sesi Foto" : "Tambah Sesi Foto"}</DialogTitle>
                  <DialogDescription>
                    {editingSession ? "Edit informasi sesi foto" : "Tambahkan sesi foto baru ke sistem"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Judul Sesi</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="photographerId">Fotografer</Label>
                      <Select
                        value={formData.photographerId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, photographerId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih fotografer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Ahmad Rizki</SelectItem>
                          <SelectItem value="2">Sari Indah</SelectItem>
                          <SelectItem value="3">Budi Santoso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="locationId">Lokasi</Label>
                      <Select
                        value={formData.locationId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, locationId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih lokasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Taman Kampus ITS</SelectItem>
                          <SelectItem value="2">Gedung Rektorat</SelectItem>
                          <SelectItem value="3">Perpustakaan Pusat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Tanggal</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
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
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="maxParticipants">Maksimal Peserta</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData((prev) => ({ ...prev, maxParticipants: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Harga</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
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
                          <SelectItem value="scheduled">Terjadwal</SelectItem>
                          <SelectItem value="ongoing">Berlangsung</SelectItem>
                          <SelectItem value="completed">Selesai</SelectItem>
                          <SelectItem value="cancelled">Dibatalkan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit">{editingSession ? "Update" : "Tambah"}</Button>
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
                      placeholder="Cari sesi foto..."
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
                      <SelectItem value="scheduled">Terjadwal</SelectItem>
                      <SelectItem value="ongoing">Berlangsung</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <CardDescription className="mt-1">{session.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(session.status)}>{getStatusText(session.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Camera className="h-4 w-4 mr-2" />
                      {session.photographerName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {session.locationName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(session.date).toLocaleDateString("id-ID")}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {session.startTime} - {session.endTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {session.currentParticipants}/{session.maxParticipants} peserta
                    </div>
                    <div className="text-lg font-bold text-blue-600">Rp {session.price.toLocaleString()}</div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(session)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(session.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada sesi foto</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Tidak ada sesi yang sesuai dengan filter"
                    : "Belum ada sesi foto yang dijadwalkan"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
