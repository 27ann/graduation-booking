"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  Search,
  UserPlus,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  Star,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Photographer {
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
}

export default function AdminPhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        // Mock data untuk fotografer
        const mockPhotographers: Photographer[] = [
          {
            id: 1,
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
            profileImage: "/placeholder.svg?height=150&width=150",
          },
          {
            id: 2,
            name: "Visual Studio Photography",
            email: "visual.studio@its.ac.id",
            phone: "081234567895",
            studioName: "Visual Studio Photography",
            specialty: ["Wisuda", "Event", "Prewedding"],
            pricePerHour: 180000,
            rating: 4.5,
            totalReviews: 85,
            totalBookings: 102,
            status: "pending",
            featured: false,
            registeredDate: "2024-06-05",
            profileImage: "/placeholder.svg?height=150&width=150",
          },
          {
            id: 3,
            name: "Kenzie Photography",
            email: "kenzie.photo@its.ac.id",
            phone: "081234567896",
            studioName: "Kenzie Photography",
            specialty: ["Portrait", "Family", "Wisuda"],
            pricePerHour: 165000,
            rating: 4.7,
            totalReviews: 93,
            totalBookings: 118,
            status: "active",
            featured: true,
            registeredDate: "2023-12-15",
            lastActive: "2024-06-10T08:30:00Z",
            profileImage: "/placeholder.svg?height=150&width=150",
          },
          {
            id: 4,
            name: "Capture Moments Studio",
            email: "capture.moments@its.ac.id",
            phone: "081234567897",
            studioName: "Capture Moments Studio",
            specialty: ["Wisuda", "Portrait", "Event"],
            pricePerHour: 145000,
            rating: 4.6,
            totalReviews: 78,
            totalBookings: 95,
            status: "inactive",
            featured: false,
            registeredDate: "2024-01-10",
            lastActive: "2024-05-20T14:45:00Z",
            profileImage: "/placeholder.svg?height=150&width=150",
          },
        ]

        setPhotographers(mockPhotographers)
      } catch (error) {
        console.error("Error fetching photographers:", error)
      }
      setLoading(false)
    }

    fetchPhotographers()
  }, [])

  const handleDeletePhotographer = (id: number) => {
    setPhotographers((prev) => prev.filter((photographer) => photographer.id !== id))
  }

  const handleToggleStatus = (id: number) => {
    setPhotographers((prev) =>
      prev.map((photographer) => {
        if (photographer.id === id) {
          const newStatus = photographer.status === "active" ? "inactive" : "active"
          return { ...photographer, status: newStatus as "active" | "inactive" | "pending" }
        }
        return photographer
      }),
    )
  }

  const handleToggleFeatured = (id: number) => {
    setPhotographers((prev) =>
      prev.map((photographer) => {
        if (photographer.id === id) {
          return { ...photographer, featured: !photographer.featured }
        }
        return photographer
      }),
    )
  }

  const handleApprovePhotographer = (id: number) => {
    setPhotographers((prev) =>
      prev.map((photographer) => {
        if (photographer.id === id) {
          return { ...photographer, status: "active" as const }
        }
        return photographer
      }),
    )
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

  const filterPhotographers = () => {
    let filtered = photographers

    // Filter by tab
    if (activeTab === "featured") {
      filtered = filtered.filter((photographer) => photographer.featured)
    } else if (activeTab === "pending") {
      filtered = filtered.filter((photographer) => photographer.status === "pending")
    } else if (activeTab !== "all") {
      filtered = filtered.filter((photographer) => photographer.status === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (photographer) =>
          photographer.name.toLowerCase().includes(query) ||
          photographer.email.toLowerCase().includes(query) ||
          photographer.studioName.toLowerCase().includes(query) ||
          photographer.specialty.some((spec) => spec.toLowerCase().includes(query)),
      )
    }

    return filtered
  }

  const getTabCount = (tab: string) => {
    if (tab === "all") return photographers.length
    if (tab === "featured") return photographers.filter((photographer) => photographer.featured).length
    return photographers.filter((photographer) => photographer.status === tab).length
  }

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data fotografer...</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Kelola Fotografer</h2>
            <p className="text-gray-600">Kelola semua fotografer dalam sistem ITS Graduation Photo</p>
          </div>

          {/* Search and Add Photographer */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Cari fotografer..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Tambah Fotografer
            </Button>
          </div>

          {/* Photographer Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Semua ({getTabCount("all")})</TabsTrigger>
              <TabsTrigger value="active">Aktif ({getTabCount("active")})</TabsTrigger>
              <TabsTrigger value="inactive">Nonaktif ({getTabCount("inactive")})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({getTabCount("pending")})</TabsTrigger>
              <TabsTrigger value="featured">Unggulan ({getTabCount("featured")})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {/* Pending Approvals */}
              {activeTab === "all" && photographers.some((photographer) => photographer.status === "pending") && (
                <Card className="mb-6 border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-800">Menunggu Persetujuan</CardTitle>
                    <CardDescription>Fotografer baru yang memerlukan persetujuan admin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {photographers
                        .filter((photographer) => photographer.status === "pending")
                        .map((photographer) => (
                          <div
                            key={photographer.id}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border"
                          >
                            <div className="flex items-center space-x-4">
                              <img
                                src={photographer.profileImage || "/placeholder.svg"}
                                alt={photographer.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-semibold">{photographer.studioName}</h4>
                                <p className="text-sm text-gray-600">{photographer.name}</p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{photographer.email}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                onClick={() => handleDeletePhotographer(photographer.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Tolak
                              </Button>
                              <Button size="sm" onClick={() => handleApprovePhotographer(photographer.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Setujui
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Photographers Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterPhotographers().map((photographer) => (
                  <Card key={photographer.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={photographer.profileImage || "/placeholder.svg"}
                        alt={photographer.name}
                        className="w-full h-48 object-cover"
                      />
                      {photographer.featured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Unggulan
                        </Badge>
                      )}
                      <Badge className={`absolute top-2 right-2 ${getStatusColor(photographer.status)}`}>
                        {getStatusText(photographer.status)}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{photographer.studioName}</h3>
                          <p className="text-sm text-gray-600">{photographer.name}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="ml-1 font-medium">{photographer.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">({photographer.totalReviews})</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {photographer.specialty.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            Rp {photographer.pricePerHour.toLocaleString("id-ID")}/jam
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Camera className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{photographer.totalBookings} booking</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1" asChild>
                          <a href={`/admin/photographers/${photographer.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Detail
                          </a>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleFeatured(photographer.id)}>
                              <Star className="h-4 w-4 mr-2" />
                              {photographer.featured ? "Hapus dari Unggulan" : "Jadikan Unggulan"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(photographer.id)}>
                              {photographer.status === "active" ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Nonaktifkan
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Aktifkan
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeletePhotographer(photographer.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filterPhotographers().length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada fotografer ditemukan</h3>
                    <p className="text-gray-500 mb-4">Tidak ada fotografer yang sesuai dengan filter Anda</p>
                    <Button onClick={() => setActiveTab("all")}>Lihat Semua Fotografer</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
