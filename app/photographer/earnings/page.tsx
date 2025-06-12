"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Calendar, Download, BarChart3, PieChart, ArrowUpRight } from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { ScrollToTop } from "@/components/scroll-to-top"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface EarningRecord {
  id: number
  date: string
  clientName: string
  sessionType: string
  amount: number
  status: "paid" | "pending" | "cancelled"
  paymentMethod: string
}

export default function PhotographerEarningsPage() {
  const { user } = useAuth()
  const [earnings, setEarnings] = useState<EarningRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    pendingPayments: 0,
    completedSessions: 0,
    averagePerSession: 0,
  })

  // Chart data dengan data yang lebih realistis
  const monthlyEarningsData = [
    { month: "Jan", earnings: 0, sessions: 0 },
    { month: "Feb", earnings: 0, sessions: 0 },
    { month: "Mar", earnings: 0, sessions: 0 },
    { month: "Apr", earnings: 0, sessions: 0 },
    { month: "May", earnings: 180000, sessions: 1 },
    { month: "Jun", earnings: 670000, sessions: 3 },
  ]

  const sessionTypeData = [
    { name: "Wisuda", value: 4, color: "#3b82f6", percentage: 50 },
    { name: "Portrait", value: 2, color: "#10b981", percentage: 25 },
    { name: "Family", value: 1, color: "#f59e0b", percentage: 13 },
    { name: "Event", value: 1, color: "#8b5cf6", percentage: 13 },
  ]

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        // Mock data untuk earnings
        const mockEarnings: EarningRecord[] = [
          {
            id: 1,
            date: "2024-06-15",
            clientName: "Ahmad Rizky Pratama",
            sessionType: "Wisuda",
            amount: 350000,
            status: "paid",
            paymentMethod: "Transfer Bank",
          },
          {
            id: 2,
            date: "2024-06-16",
            clientName: "Sari Indah Permata",
            sessionType: "Family Portrait",
            amount: 450000,
            status: "pending",
            paymentMethod: "Cash",
          },
          {
            id: 3,
            date: "2024-06-12",
            clientName: "Budi Santoso",
            sessionType: "Individual Portrait",
            amount: 320000,
            status: "paid",
            paymentMethod: "E-Wallet",
          },
          {
            id: 4,
            date: "2024-05-28",
            clientName: "Rina Sari",
            sessionType: "Wisuda",
            amount: 180000,
            status: "paid",
            paymentMethod: "Transfer Bank",
          },
        ]

        setEarnings(mockEarnings)

        const totalEarnings = mockEarnings.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.amount, 0)
        const pendingPayments = mockEarnings.filter((e) => e.status === "pending").reduce((sum, e) => sum + e.amount, 0)
        const completedSessions = mockEarnings.filter((e) => e.status === "paid").length

        setStats({
          totalEarnings,
          thisMonth: 670000,
          lastMonth: 180000,
          pendingPayments,
          completedSessions,
          averagePerSession: completedSessions > 0 ? totalEarnings / completedSessions : 0,
        })
      } catch (error) {
        console.error("Error fetching earnings:", error)
      }
      setLoading(false)
    }

    fetchEarnings()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Dibayar"
      case "pending":
        return "Menunggu"
      case "cancelled":
        return "Dibatalkan"
      default:
        return status
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ["Tanggal", "Klien", "Jenis Sesi", "Jumlah", "Status", "Metode Pembayaran"],
      ...earnings.map((earning) => [
        new Date(earning.date).toLocaleDateString("id-ID"),
        earning.clientName,
        earning.sessionType,
        earning.amount.toString(),
        getStatusText(earning.status),
        earning.paymentMethod,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `earnings-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Custom tooltip untuk line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Bulan: ${label}`}</p>
          <p className="text-blue-600">{`Pendapatan: Rp ${payload[0].value.toLocaleString("id-ID")}`}</p>
          <p className="text-gray-600">{`Sesi: ${payload[0].payload.sessions}`}</p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip untuk pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-blue-600">{`Jumlah: ${payload[0].value} sesi`}</p>
          <p className="text-gray-600">{`Persentase: ${payload[0].payload.percentage}%`}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data pendapatan...</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Laporan Pendapatan</h2>
            <p className="text-gray-600">Monitor dan analisis pendapatan dari layanan fotografi Anda</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {stats.totalEarnings.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />+
                    {stats.lastMonth > 0
                      ? (((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100).toFixed(1)
                      : "100"}
                    %
                  </span>
                  dari bulan lalu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pembayaran Tertunda</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {stats.pendingPayments.toLocaleString("id-ID")}</div>
                <p className="text-xs text-muted-foreground">
                  {earnings.filter((e) => e.status === "pending").length} sesi menunggu pembayaran
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata per Sesi</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {Math.round(stats.averagePerSession).toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-muted-foreground">{stats.completedSessions} sesi selesai</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transaksi</TabsTrigger>
              <TabsTrigger value="analytics">Analitik</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Earnings Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Tren Pendapatan
                    </CardTitle>
                    <CardDescription>Pendapatan bulanan dalam 6 bulan terakhir</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyEarningsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" stroke="#666" fontSize={12} />
                          <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="earnings"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Session Type Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="h-5 w-5 mr-2" />
                      Kategori Sesi
                    </CardTitle>
                    <CardDescription>Distribusi jenis sesi foto</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RPieChart>
                          <Pie
                            data={sessionTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name} ${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {sessionTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomPieTooltip />} />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value, entry: any) => <span style={{ color: entry.color }}>{value}</span>}
                          />
                        </RPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Riwayat Transaksi</h3>
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <div className="space-y-4">
                {earnings.map((earning) => (
                  <Card key={earning.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{earning.clientName}</h4>
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center space-x-4">
                                <span>{earning.sessionType}</span>
                                <span>{new Date(earning.date).toLocaleDateString("id-ID")}</span>
                                <span>{earning.paymentMethod}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">Rp {earning.amount.toLocaleString("id-ID")}</div>
                          <Badge className={getStatusColor(earning.status)}>{getStatusText(earning.status)}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {earnings.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada transaksi</h3>
                      <p className="text-gray-600">Transaksi akan muncul setelah Anda menyelesaikan sesi foto</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performa Bulanan</CardTitle>
                    <CardDescription>Analisis pendapatan dan jumlah sesi</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bulan ini</span>
                      <span className="font-semibold">Rp {stats.thisMonth.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bulan lalu</span>
                      <span className="font-semibold">Rp {stats.lastMonth.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pertumbuhan</span>
                      <span className="font-semibold text-green-600">
                        +
                        {stats.lastMonth > 0
                          ? (((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100).toFixed(1)
                          : "100"}
                        %
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Target Bulanan</CardTitle>
                    <CardDescription>Progress menuju target pendapatan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Target</span>
                      <span className="font-semibold">Rp 1.000.000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tercapai</span>
                      <span className="font-semibold">Rp {stats.thisMonth.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((stats.thisMonth / 1000000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      {((stats.thisMonth / 1000000) * 100).toFixed(1)}% dari target
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <ScrollToTop />
      </RoleBasedLayout>
    </AuthGuard>
  )
}
