"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Camera,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  Settings,
} from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import Link from "next/link"

interface AdminStats {
  totalUsers: number
  totalPhotographers: number
  totalStudents: number
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  activePhotoSpots: number
  averageRating: number
}

interface Activity {
  id: number
  type: string
  message: string
  time: string
  status: string
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPhotographers: 0,
    totalStudents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    activePhotoSpots: 0,
    averageRating: 0,
  })
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Mock data untuk admin
        const mockStats: AdminStats = {
          totalUsers: 25,
          totalPhotographers: 5,
          totalStudents: 18,
          totalBookings: 30,
          totalRevenue: 8540000,
          pendingBookings: 5,
          activePhotoSpots: 25,
          averageRating: 4.7,
        }

        const mockActivities: Activity[] = [
          {
            id: 1,
            type: "booking",
            message: "Booking baru dari Ahmad Rizky Pratama",
            time: "2 menit yang lalu",
            status: "pending",
          },
          {
            id: 2,
            type: "user",
            message: "Fotografer baru mendaftar: Visual Studio Pro",
            time: "1 jam yang lalu",
            status: "new",
          },
          {
            id: 3,
            type: "booking",
            message: "Booking dikonfirmasi oleh Studio Foto Kenzie",
            time: "3 jam yang lalu",
            status: "confirmed",
          },
          {
            id: 4,
            type: "payment",
            message: "Pembayaran diterima untuk booking #12345",
            time: "5 jam yang lalu",
            status: "completed",
          },
        ]

        setStats(mockStats)
        setRecentActivities(mockActivities)
      } catch (error) {
        console.error("Error fetching admin data:", error)
      }
      setLoading(false)
    }

    fetchAdminData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard requiredUserType={["admin"]}>
      <RoleBasedLayout>
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h2>
            <p className="text-gray-600">Selamat datang, {user?.fullName}! Kelola sistem ITS Graduation Photo.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalStudents} mahasiswa, {stats.totalPhotographers} fotografer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">{stats.pendingBookings} menunggu konfirmasi</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {stats.totalRevenue.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">Dari semua booking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageRating}</div>
                <p className="text-xs text-muted-foreground">Rating sistem</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Kelola sistem dengan mudah</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <Button asChild className="h-20 flex-col">
                  <Link href="/admin/users">
                    <Users className="h-6 w-6 mb-2" />
                    Kelola User
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link href="/admin/photographers">
                    <Camera className="h-6 w-6 mb-2" />
                    Kelola Fotografer
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link href="/admin/bookings">
                    <Calendar className="h-6 w-6 mb-2" />
                    Kelola Booking
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link href="/admin/photo-spots">
                    <MapPin className="h-6 w-6 mb-2" />
                    Kelola Lokasi
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link href="/admin/reports">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Laporan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>Aktivitas sistem dalam 24 jam terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === "booking" && <Calendar className="h-5 w-5 text-blue-600" />}
                        {activity.type === "user" && <Users className="h-5 w-5 text-green-600" />}
                        {activity.type === "payment" && <DollarSign className="h-5 w-5 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          activity.status === "pending"
                            ? "text-yellow-600"
                            : activity.status === "confirmed"
                              ? "text-green-600"
                              : activity.status === "new"
                                ? "text-blue-600"
                                : "text-purple-600"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status Sistem</CardTitle>
                <CardDescription>Ringkasan status komponen sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Database</p>
                        <p className="text-sm text-gray-600">Berjalan normal</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Payment Gateway</p>
                        <p className="text-sm text-gray-600">Berjalan normal</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">Email Service</p>
                        <p className="text-sm text-gray-600">Maintenance terjadwal</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">File Storage</p>
                        <p className="text-sm text-gray-600">85% kapasitas</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Normal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Manajemen Sistem
              </CardTitle>
              <CardDescription>Tools untuk mengelola sistem secara keseluruhan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/admin/settings">
                    <Settings className="h-5 w-5 mb-1" />
                    Pengaturan Sistem
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/admin/backup">
                    <CheckCircle className="h-5 w-5 mb-1" />
                    Backup Data
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/admin/logs">
                    <AlertCircle className="h-5 w-5 mb-1" />
                    System Logs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
