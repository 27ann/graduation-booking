"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Search, Filter } from "lucide-react"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { AuthGuard } from "@/components/auth-guard"
import { ScrollToTop } from "@/components/scroll-to-top"
import Link from "next/link"

interface PhotoSession {
  ps_id: number
  ps_name: string
  ps_starttime: string
  ps_endtime: string
  ps_status: string
  max_participants: number
  available_spots: number
  total_bookings: number
  avg_price: number
  description: string
  category: string
  selected_date?: string
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<PhotoSession[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("available")
  const [sessionType, setSessionType] = useState("all")

  const searchSessions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/sessions/search?status=${statusFilter}&type=${sessionType}`)
      const data = await response.json()
      setSessions(data)
    } catch (error) {
      console.error("Error fetching sessions:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    searchSessions()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "full":
        return "bg-red-100 text-red-800"
      case "limited":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "wisuda":
        return "Wisuda"
      case "pre-graduation":
        return "Pre-Graduation"
      case "group":
        return "Group"
      case "individual":
        return "Individual"
      case "family":
        return "Family"
      case "professional":
        return "Professional"
      default:
        return "Lainnya"
    }
  }

  const getSessionStatus = (session: PhotoSession) => {
    if (session.available_spots === 0) return "full"
    if (session.available_spots <= 2) return "limited"
    return "available"
  }

  return (
    <AuthGuard requiredUserType={["student"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sesi Foto Tersedia</h2>
            <p className="text-gray-600">Pilih sesi foto yang sesuai dengan kebutuhan Anda</p>
          </div>

          {/* Search Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filter Sesi Foto
              </CardTitle>
              <CardDescription>Filter sesi foto berdasarkan kategori dan ketersediaan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="available">Tersedia</SelectItem>
                      <SelectItem value="limited">Terbatas</SelectItem>
                      <SelectItem value="full">Penuh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Kategori Sesi</Label>
                  <Select value={sessionType} onValueChange={setSessionType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      <SelectItem value="wisuda">Wisuda</SelectItem>
                      <SelectItem value="pre-graduation">Pre-Graduation</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={searchSessions} className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Cari
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Mencari sesi foto...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => {
                const currentStatus = getSessionStatus(session)
                return (
                  <Card key={session.ps_id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{session.ps_name}</CardTitle>
                        <Badge className={getStatusColor(currentStatus)}>
                          {currentStatus === "available"
                            ? "Tersedia"
                            : currentStatus === "limited"
                              ? "Terbatas"
                              : "Penuh"}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className="mb-2">
                          {getCategoryName(session.category)}
                        </Badge>
                        <CardDescription className="mt-2">{session.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Durasi Rekomendasi
                          </span>
                          <span className="font-medium">2-3 jam</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Kapasitas
                          </span>
                          <span className="font-medium">{session.max_participants} orang</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Harga mulai dari</span>
                          <span className="font-medium text-blue-600">
                            Rp {session.avg_price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Button className="w-full" asChild>
                          <Link href={`/booking?session=${session.ps_id}`}>Pilih Sesi Ini</Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/sessions/${session.ps_id}`}>Lihat Detail</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {!loading && sessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada sesi tersedia</h3>
              <p className="text-gray-600 mb-4">Coba ubah filter pencarian</p>
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("available")
                  setSessionType("all")
                  searchSessions()
                }}
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>
        <ScrollToTop />
      </RoleBasedLayout>
    </AuthGuard>
  )
}
