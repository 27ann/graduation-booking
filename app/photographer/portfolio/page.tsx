"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Camera, Trash2, Edit, Save, X, Plus, Star, Eye, Heart, MessageCircle } from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PortfolioItem {
  id: number
  title: string
  description: string
  imageUrl: string
  category: "graduation" | "portrait" | "family" | "event" | "prewedding"
  tags: string[]
  likes: number
  views: number
  comments: number
  createdAt: string
  featured: boolean
}

interface PhotographerProfile {
  id: number
  name: string
  bio: string
  specialty: string[]
  experience: number
  pricePerHour: number
  rating: number
  totalReviews: number
  profileImage: string
  coverImage: string
}

export default function PhotographerPortfolioPage() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [profile, setProfile] = useState<PhotographerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "graduation" as const,
    tags: [] as string[],
    featured: false,
  })

  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Mock data untuk portfolio fotografer
        const mockProfile: PhotographerProfile = {
          id: 1,
          name: "Studio Foto Profesional",
          bio: "Fotografer profesional dengan pengalaman 5+ tahun dalam fotografi wisuda dan portrait. Spesialisasi dalam mengabadikan momen berharga dengan kualitas terbaik.",
          specialty: ["Fotografi Wisuda", "Portrait", "Family Photo", "Event"],
          experience: 5,
          pricePerHour: 150000,
          rating: 4.8,
          totalReviews: 127,
          profileImage: "/placeholder.svg?height=150&width=150",
          coverImage: "/placeholder.svg?height=300&width=800",
        }

        const mockPortfolio: PortfolioItem[] = [
          {
            id: 1,
            title: "Wisuda ITS Batch 2023",
            description: "Sesi foto wisuda di Gedung Rektorat ITS dengan pencahayaan natural yang sempurna",
            imageUrl: "/placeholder.svg?height=400&width=600",
            category: "graduation",
            tags: ["wisuda", "ITS", "formal", "outdoor"],
            likes: 45,
            views: 234,
            comments: 12,
            createdAt: "2024-03-15",
            featured: true,
          },
          {
            id: 2,
            title: "Family Portrait Session",
            description: "Sesi foto keluarga di Taman Teknologi ITS dengan suasana hangat dan natural",
            imageUrl: "/placeholder.svg?height=400&width=600",
            category: "family",
            tags: ["family", "outdoor", "natural", "candid"],
            likes: 32,
            views: 189,
            comments: 8,
            createdAt: "2024-03-10",
            featured: false,
          },
          {
            id: 3,
            title: "Individual Portrait",
            description: "Portrait profesional dengan teknik lighting studio untuk hasil yang memukau",
            imageUrl: "/placeholder.svg?height=400&width=600",
            category: "portrait",
            tags: ["portrait", "studio", "professional", "lighting"],
            likes: 28,
            views: 156,
            comments: 5,
            createdAt: "2024-03-05",
            featured: true,
          },
        ]

        setProfile(mockProfile)
        setPortfolio(mockPortfolio)
      } catch (error) {
        console.error("Error fetching portfolio data:", error)
      }
      setLoading(false)
    }

    fetchPortfolioData()
  }, [])

  const handleAddTag = () => {
    if (newTag.trim() && !newItem.tags.includes(newTag.trim())) {
      setNewItem((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewItem((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSaveNewItem = () => {
    if (newItem.title && newItem.description && newItem.imageUrl) {
      const portfolioItem: PortfolioItem = {
        id: Date.now(),
        ...newItem,
        likes: 0,
        views: 0,
        comments: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }

      setPortfolio((prev) => [portfolioItem, ...prev])
      setNewItem({
        title: "",
        description: "",
        imageUrl: "",
        category: "graduation",
        tags: [],
        featured: false,
      })
      setIsAddingNew(false)
    }
  }

  const handleDeleteItem = (id: number) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id))
  }

  const handleToggleFeatured = (id: number) => {
    setPortfolio((prev) => prev.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item)))
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      graduation: "Wisuda",
      portrait: "Portrait",
      family: "Keluarga",
      event: "Event",
      prewedding: "Prewedding",
    }
    return labels[category as keyof typeof labels] || category
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      graduation: "bg-blue-100 text-blue-800",
      portrait: "bg-purple-100 text-purple-800",
      family: "bg-green-100 text-green-800",
      event: "bg-orange-100 text-orange-800",
      prewedding: "bg-pink-100 text-pink-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat portfolio...</p>
          </div>
        </div>
      </RoleBasedLayout>
    )
  }

  return (
    <AuthGuard requiredUserType={["photographer"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Saya</h2>
            <p className="text-gray-600">Kelola dan showcase karya fotografi terbaik Anda</p>
          </div>

          {/* Profile Section */}
          {profile && (
            <Card className="mb-8">
              <div
                className="h-48 bg-cover bg-center rounded-t-lg"
                style={{ backgroundImage: `url(${profile.coverImage})` }}
              >
                <div className="h-full bg-black bg-opacity-40 rounded-t-lg flex items-end p-6">
                  <div className="flex items-end space-x-4">
                    <img
                      src={profile.profileImage || "/placeholder.svg"}
                      alt={profile.name}
                      className="w-24 h-24 rounded-full border-4 border-white"
                    />
                    <div className="text-white">
                      <h3 className="text-2xl font-bold">{profile.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{profile.rating}</span>
                          <span className="text-sm">({profile.totalReviews} reviews)</span>
                        </div>
                        <span className="text-sm">{profile.experience} tahun pengalaman</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-gray-600 text-sm">{profile.bio}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Spesialisasi</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.specialty.map((spec, index) => (
                        <Badge key={index} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Tarif:{" "}
                        <span className="font-semibold">Rp {profile.pricePerHour.toLocaleString("id-ID")}/jam</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => setEditingProfile(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Portfolio Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{portfolio.length}</div>
                <div className="text-sm text-gray-600">Total Karya</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{portfolio.reduce((sum, item) => sum + item.views, 0)}</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{portfolio.reduce((sum, item) => sum + item.likes, 0)}</div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{portfolio.reduce((sum, item) => sum + item.comments, 0)}</div>
                <div className="text-sm text-gray-600">Total Comments</div>
              </CardContent>
            </Card>
          </div>

          {/* Add New Item Button */}
          <div className="mb-6">
            <Button onClick={() => setIsAddingNew(true)} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Karya Baru
            </Button>
          </div>

          {/* Add New Item Form */}
          {isAddingNew && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Tambah Karya Baru</CardTitle>
                <CardDescription>Upload dan deskripsikan karya fotografi terbaru Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Judul Karya</Label>
                    <Input
                      id="title"
                      value={newItem.title}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Masukkan judul karya"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem((prev) => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduation">Wisuda</SelectItem>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="family">Keluarga</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="prewedding">Prewedding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsikan karya Anda..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">URL Gambar</Label>
                  <Input
                    id="imageUrl"
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Tambah tag"
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      Tambah
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newItem.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newItem.featured}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, featured: e.target.checked }))}
                  />
                  <Label htmlFor="featured">Jadikan karya unggulan</Label>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleSaveNewItem}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  {item.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      Unggulan
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button size="sm" variant="secondary" onClick={() => handleToggleFeatured(item.id)}>
                      <Star className={`h-3 w-3 ${item.featured ? "fill-current text-yellow-500" : ""}`} />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge className={getCategoryColor(item.category)}>{getCategoryLabel(item.category)}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                    <span>{new Date(item.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {portfolio.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum ada karya</h3>
                <p className="text-gray-500 mb-4">Mulai upload karya fotografi terbaik Anda</p>
                <Button onClick={() => setIsAddingNew(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Karya Pertama
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
