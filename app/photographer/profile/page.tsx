"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Edit, Save, X, Upload, Star, MapPin, Phone, Mail, Calendar, ArrowLeft } from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useRouter } from "next/navigation"

interface PhotographerProfile {
  id: number
  name: string
  email: string
  phone: string
  bio: string
  specialty: string[]
  experience: number
  pricePerHour: number
  location: string
  profileImage: string
  rating: number
  totalBookings: number
  joinDate: string
  status: "active" | "inactive"
  featured: boolean
}

export default function PhotographerProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<PhotographerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [editedProfile, setEditedProfile] = useState<PhotographerProfile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Mock data untuk profil fotografer
        const mockProfile: PhotographerProfile = {
          id: 1,
          name: "Studio Foto Kenzie",
          email: "kenzie.studio@its.ac.id",
          phone: "+62 812-3456-7890",
          bio: "Fotografer profesional dengan pengalaman 5+ tahun dalam bidang fotografi wisuda dan portrait. Spesialisasi dalam mengabadikan momen-momen berharga dengan kualitas terbaik.",
          specialty: ["Graduation", "Portrait", "Event"],
          experience: 5,
          pricePerHour: 150000,
          location: "Surabaya, Jawa Timur",
          profileImage: "/placeholder.svg?height=200&width=200",
          rating: 4.8,
          totalBookings: 127,
          joinDate: "2019-03-15",
          status: "active",
          featured: true,
        }

        setProfile(mockProfile)
        setEditedProfile(mockProfile)
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleSaveProfile = async () => {
    if (!editedProfile) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProfile(editedProfile)
      setEditing(false)
      alert("Profil berhasil diperbarui!")
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan profil")
    }
  }

  const handleCancelEdit = () => {
    setEditedProfile(profile)
    setEditing(false)
  }

  const handleSpecialtyChange = (specialty: string) => {
    if (!editedProfile) return

    const currentSpecialties = editedProfile.specialty
    const newSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter((s) => s !== specialty)
      : [...currentSpecialties, specialty]

    setEditedProfile({
      ...editedProfile,
      specialty: newSpecialties,
    })
  }

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat profil...</p>
          </div>
        </div>
      </RoleBasedLayout>
    )
  }

  if (!profile) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil tidak ditemukan</h2>
            <p className="text-gray-600">Terjadi kesalahan saat memuat profil Anda</p>
          </div>
        </div>
      </RoleBasedLayout>
    )
  }

  return (
    <AuthGuard requiredUserType={["photographer"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Profil Saya</h2>
              <p className="text-gray-600">Kelola informasi profil dan pengaturan akun Anda</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan</TabsTrigger>
              <TabsTrigger value="statistics">Statistik</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Informasi Profil</CardTitle>
                    <CardDescription>Kelola informasi dasar profil fotografer Anda</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {editing ? (
                      <>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-2" />
                          Batal
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          <Save className="h-4 w-4 mr-2" />
                          Simpan
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profil
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={profile.profileImage || "/placeholder.svg"}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      {editing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full"
                          onClick={() => setShowImageDialog(true)}
                        >
                          <Camera className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{profile.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {profile.rating}
                        </div>
                        <span>{profile.totalBookings} booking</span>
                        <Badge variant={profile.status === "active" ? "default" : "secondary"}>
                          {profile.status === "active" ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                        {profile.featured && <Badge variant="outline">Featured</Badge>}
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Studio/Fotografer</Label>
                      <Input
                        id="name"
                        value={editing ? editedProfile?.name : profile.name}
                        onChange={(e) =>
                          editing && editedProfile && setEditedProfile({ ...editedProfile, name: e.target.value })
                        }
                        disabled={!editing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editing ? editedProfile?.email : profile.email}
                        onChange={(e) =>
                          editing && editedProfile && setEditedProfile({ ...editedProfile, email: e.target.value })
                        }
                        disabled={!editing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        value={editing ? editedProfile?.phone : profile.phone}
                        onChange={(e) =>
                          editing && editedProfile && setEditedProfile({ ...editedProfile, phone: e.target.value })
                        }
                        disabled={!editing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Lokasi</Label>
                      <Input
                        id="location"
                        value={editing ? editedProfile?.location : profile.location}
                        onChange={(e) =>
                          editing && editedProfile && setEditedProfile({ ...editedProfile, location: e.target.value })
                        }
                        disabled={!editing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Pengalaman (tahun)</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={editing ? editedProfile?.experience : profile.experience}
                        onChange={(e) =>
                          editing &&
                          editedProfile &&
                          setEditedProfile({ ...editedProfile, experience: Number.parseInt(e.target.value) })
                        }
                        disabled={!editing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pricePerHour">Harga per Jam (Rp)</Label>
                      <Input
                        id="pricePerHour"
                        type="number"
                        value={editing ? editedProfile?.pricePerHour : profile.pricePerHour}
                        onChange={(e) =>
                          editing &&
                          editedProfile &&
                          setEditedProfile({ ...editedProfile, pricePerHour: Number.parseInt(e.target.value) })
                        }
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio/Deskripsi</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={editing ? editedProfile?.bio : profile.bio}
                      onChange={(e) =>
                        editing && editedProfile && setEditedProfile({ ...editedProfile, bio: e.target.value })
                      }
                      disabled={!editing}
                    />
                  </div>

                  {/* Specialties */}
                  <div className="space-y-2">
                    <Label>Spesialisasi</Label>
                    {editing ? (
                      <div className="space-y-2">
                        {["Graduation", "Portrait", "Wedding", "Event", "Family", "Corporate"].map((specialty) => (
                          <label key={specialty} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={editedProfile?.specialty.includes(specialty)}
                              onChange={() => handleSpecialtyChange(specialty)}
                              className="rounded"
                            />
                            <span>{specialty}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.specialty.map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Akun</CardTitle>
                  <CardDescription>Kelola pengaturan keamanan dan preferensi akun</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Status Akun</h4>
                        <p className="text-sm text-gray-600">Aktifkan atau nonaktifkan profil Anda</p>
                      </div>
                      <Select value={profile.status}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Tidak Aktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Featured Photographer</h4>
                        <p className="text-sm text-gray-600">Tampilkan profil di halaman utama</p>
                      </div>
                      <Badge variant={profile.featured ? "default" : "secondary"}>
                        {profile.featured ? "Ya" : "Tidak"}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Ubah Password</h4>
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Password Saat Ini</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Password Baru</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      <Button>Ubah Password</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{profile.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">Sejak bergabung</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{profile.rating}</div>
                    <p className="text-xs text-muted-foreground">Dari 5.0</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bergabung</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Date().getFullYear() - new Date(profile.joinDate).getFullYear()}
                    </div>
                    <p className="text-xs text-muted-foreground">Tahun</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Informasi Akun</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span>Bergabung {new Date(profile.joinDate).toLocaleDateString("id-ID")}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Image Upload Dialog */}
          <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ubah Foto Profil</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG atau JPEG (MAX. 2MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                  Batal
                </Button>
                <Button onClick={() => setShowImageDialog(false)}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollToTop />
      </RoleBasedLayout>
    </AuthGuard>
  )
}
