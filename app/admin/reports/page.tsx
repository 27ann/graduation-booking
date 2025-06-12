"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Camera, Calendar, DollarSign, Download, BarChart3, Activity, MapPin } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"

interface ReportData {
  totalUsers: number
  totalPhotographers: number
  totalBookings: number
  totalRevenue: number
  monthlyBookings: { month: string; count: number }[]
  topPhotographers: { name: string; bookings: number; revenue: number }[]
  topLocations: { name: string; bookings: number; revenue: number }[]
  userGrowth: { month: string; students: number; photographers: number }[]
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedYear, setSelectedYear] = useState("2024")

  useEffect(() => {
    fetchReportData()
  }, [selectedPeriod, selectedYear])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockData: ReportData = {
        totalUsers: 1250,
        totalPhotographers: 45,
        totalBookings: 320,
        totalRevenue: 48500000,
        monthlyBookings: [
          { month: "Jan", count: 25 },
          { month: "Feb", count: 32 },
          { month: "Mar", count: 28 },
          { month: "Apr", count: 35 },
          { month: "May", count: 42 },
          { month: "Jun", count: 38 },
          { month: "Jul", count: 45 },
          { month: "Aug", count: 52 },
          { month: "Sep", count: 48 },
          { month: "Oct", count: 55 },
          { month: "Nov", count: 62 },
          { month: "Dec", count: 58 },
        ],
        topPhotographers: [
          { name: "Ahmad Rizki", bookings: 45, revenue: 6750000 },
          { name: "Sari Indah", bookings: 38, revenue: 5700000 },
          { name: "Budi Santoso", bookings: 32, revenue: 4800000 },
          { name: "Maya Putri", bookings: 28, revenue: 4200000 },
          { name: "Doni Pratama", bookings: 25, revenue: 3750000 },
        ],
        topLocations: [
          { name: "Taman Kampus ITS", bookings: 85, revenue: 4250000 },
          { name: "Gedung Rektorat", bookings: 72, revenue: 5400000 },
          { name: "Perpustakaan Pusat", bookings: 68, revenue: 4080000 },
          { name: "Lab Komputer", bookings: 45, revenue: 2700000 },
          { name: "Aula Utama", bookings: 38, revenue: 3040000 },
        ],
        userGrowth: [
          { month: "Jan", students: 95, photographers: 3 },
          { month: "Feb", students: 108, photographers: 4 },
          { month: "Mar", students: 125, photographers: 2 },
          { month: "Apr", students: 142, photographers: 5 },
          { month: "May", students: 158, photographers: 3 },
          { month: "Jun", students: 175, photographers: 4 },
        ],
      }

      setReportData(mockData)
    } catch (error) {
      console.error("Error fetching report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (type: string) => {
    // Simulate export functionality
    alert(`Mengekspor laporan ${type}...`)
  }

  if (loading) {
    return (
      <AuthGuard requiredUserType="admin">
        <RoleBasedLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Memuat data laporan...</p>
            </div>
          </div>
        </RoleBasedLayout>
      </AuthGuard>
    )
  }

  if (!reportData) {
    return (
      <AuthGuard requiredUserType="admin">
        <RoleBasedLayout>
          <div className="text-center py-8">
            <p className="text-gray-500">Gagal memuat data laporan</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Laporan & Analitik</h1>
              <p className="text-gray-600">Dashboard analitik dan laporan sistem</p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Minggu</SelectItem>
                  <SelectItem value="month">Bulan</SelectItem>
                  <SelectItem value="year">Tahun</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => exportReport("pdf")}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> dari bulan lalu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Fotografer</CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalPhotographers}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> dari bulan lalu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+15%</span> dari bulan lalu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {(reportData.totalRevenue / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+18%</span> dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="bookings">Booking</TabsTrigger>
              <TabsTrigger value="users">Pengguna</TabsTrigger>
              <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
              <TabsTrigger value="performance">Performa</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Booking per Bulan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {reportData.monthlyBookings.slice(-6).map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.month}</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(item.count / 70) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-8">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Lokasi Terpopuler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reportData.topLocations.map((location, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{location.name}</p>
                            <p className="text-sm text-gray-500">{location.bookings} booking</p>
                          </div>
                          <Badge variant="secondary">Rp {(location.revenue / 1000000).toFixed(1)}M</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Pertumbuhan Pengguna
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.userGrowth.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.month}</span>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Mahasiswa</p>
                            <p className="font-bold text-blue-600">{item.students}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Fotografer</p>
                            <p className="font-bold text-green-600">{item.photographers}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Fotografer Terbaik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.topPhotographers.map((photographer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{photographer.name}</p>
                            <p className="text-sm text-gray-500">{photographer.bookings} booking</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Rp {(photographer.revenue / 1000000).toFixed(1)}M
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Tingkat Kepuasan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Sangat Puas</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                          <span className="text-sm">75%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Puas</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                          <span className="text-sm">20%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Kurang Puas</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                          </div>
                          <span className="text-sm">5%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistik Sistem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uptime Sistem</span>
                        <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time</span>
                        <Badge variant="secondary">120ms</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Sessions</span>
                        <Badge variant="secondary">245</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage Used</span>
                        <Badge variant="secondary">2.4GB</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
