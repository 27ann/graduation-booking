"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Users, Calendar, DollarSign, Star, TrendingUp } from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface GraduateDashboard {
  u_id: number
  graduate_name: string
  u_email: string
  total_bookings: number
  confirmed_bookings: number
  pending_bookings: number
  cancelled_bookings: number
  total_spent: number
  avg_booking_price: number
  latest_booking_date: string
  booked_sessions: string
}

interface PhotographerDashboard {
  p_id: number
  photographer_name: string
  u_email: string
  u_phonenumber: string
  p_specialty: string
  p_rating: number
  p_price_per_hour: number
  p_experienceyears: number
  total_bookings: number
  confirmed_bookings: number
  total_revenue: number
  avg_booking_value: number
  working_days: number
  available_schedules: number
  booking_rate_percentage: number
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const [graduateData, setGraduateData] = useState<GraduateDashboard[]>([])
  const [photographerData, setPhotographerData] = useState<PhotographerDashboard[]>([])
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/login")
      return
    }

    // Redirect based on user type
    if (user.userType === "admin") {
      router.push("/dashboard/admin")
    } else if (user.userType === "photographer") {
      router.push("/dashboard/photographer")
    } else {
      router.push("/dashboard/student")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [graduateResponse, photographerResponse] = await Promise.all([
          fetch("/api/dashboard/graduate"),
          fetch("/api/dashboard/photographer"),
        ])

        const graduateData = await graduateResponse.json()
        const photographerData = await photographerResponse.json()

        setGraduateData(graduateData)
        setPhotographerData(photographerData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    if (user && user.userType === "admin") {
      fetchDashboardData()
    }
  }, [user])

  if (loading || !user || user.userType !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Update Header dengan user info */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Camera className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">ITS Graduation Photo</h1>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/photographers" className="text-gray-600 hover:text-blue-600">
                  Fotografer
                </Link>
                <Link href="/photo-spots" className="text-gray-600 hover:text-blue-600">
                  Lokasi Foto
                </Link>
                <Link href="/sessions" className="text-gray-600 hover:text-blue-600">
                  Sesi Foto
                </Link>
                <Link href="/dashboard" className="text-blue-600 font-medium">
                  Dashboard
                </Link>
              </nav>
              {user && (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-gray-600">{user.userType}</p>
                  </div>
                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">Ringkasan data mahasiswa dan fotografer dalam sistem</p>
          </div>

          <Tabs defaultValue="students" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="students">Dashboard Mahasiswa</TabsTrigger>
              <TabsTrigger value="photographers">Dashboard Fotografer</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{graduateData.length}</div>
                    <p className="text-xs text-muted-foreground">Terdaftar dalam sistem</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {graduateData.reduce((sum, student) => sum + student.total_bookings, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Semua booking mahasiswa</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Rp{" "}
                      {graduateData
                        .reduce((sum, student) => sum + (student.total_spent || 0), 0)
                        .toLocaleString("id-ID")}
                    </div>
                    <p className="text-xs text-muted-foreground">Dari booking terkonfirmasi</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rata-rata Booking</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(
                        graduateData.reduce((sum, student) => sum + student.total_bookings, 0) / graduateData.length
                      ).toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground">Per mahasiswa</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Data Mahasiswa</CardTitle>
                  <CardDescription>Ringkasan aktivitas booking setiap mahasiswa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {graduateData.slice(0, 10).map((student) => (
                      <div key={student.u_id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{student.graduate_name}</h4>
                          <p className="text-sm text-gray-600">{student.u_email}</p>
                          {student.booked_sessions && (
                            <p className="text-xs text-gray-500 mt-1">Sesi: {student.booked_sessions}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium">{student.total_bookings}</div>
                            <div className="text-xs text-gray-500">Total</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-green-600">{student.confirmed_bookings}</div>
                            <div className="text-xs text-gray-500">Konfirmasi</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-yellow-600">{student.pending_bookings}</div>
                            <div className="text-xs text-gray-500">Pending</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">
                              Rp {(student.total_spent || 0).toLocaleString("id-ID")}
                            </div>
                            <div className="text-xs text-gray-500">Total Bayar</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photographers" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Fotografer</CardTitle>
                    <Camera className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{photographerData.length}</div>
                    <p className="text-xs text-muted-foreground">Fotografer aktif</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Rp{" "}
                      {photographerData
                        .reduce((sum, photographer) => sum + (photographer.total_revenue || 0), 0)
                        .toLocaleString("id-ID")}
                    </div>
                    <p className="text-xs text-muted-foreground">Total pendapatan fotografer</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rata-rata Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(
                        photographerData.reduce((sum, photographer) => sum + photographer.p_rating, 0) /
                        photographerData.length
                      ).toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground">Rating keseluruhan</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Booking Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(
                        photographerData.reduce(
                          (sum, photographer) => sum + (photographer.booking_rate_percentage || 0),
                          0,
                        ) / photographerData.length
                      ).toFixed(1)}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">Rata-rata tingkat booking</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Data Fotografer</CardTitle>
                  <CardDescription>Performa bisnis setiap fotografer dalam sistem</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {photographerData.map((photographer) => (
                      <div key={photographer.p_id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{photographer.photographer_name}</h4>
                          <p className="text-sm text-gray-600">{photographer.p_specialty}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{photographer.p_rating}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {photographer.p_experienceyears} tahun pengalaman
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium">{photographer.total_bookings}</div>
                            <div className="text-xs text-gray-500">Total Booking</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-green-600">{photographer.confirmed_bookings}</div>
                            <div className="text-xs text-gray-500">Konfirmasi</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">
                              Rp {(photographer.total_revenue || 0).toLocaleString("id-ID")}
                            </div>
                            <div className="text-xs text-gray-500">Revenue</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-blue-600">
                              {photographer.booking_rate_percentage || 0}%
                            </div>
                            <div className="text-xs text-gray-500">Booking Rate</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
