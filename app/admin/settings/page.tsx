"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Database,
  Shield,
  Bell,
  Globe,
  Clock,
  HardDrive,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"

interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    timezone: string
    language: string
    maintenanceMode: boolean
  }
  booking: {
    maxBookingDays: number
    minBookingHours: number
    cancellationHours: number
    autoConfirm: boolean
    requirePayment: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    adminNotifications: boolean
  }
  security: {
    sessionTimeout: number
    maxLoginAttempts: number
    requireEmailVerification: boolean
    twoFactorAuth: boolean
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: "ITS Graduation Photo",
      siteDescription: "Platform booking foto wisuda ITS",
      contactEmail: "admin@its.ac.id",
      timezone: "Asia/Jakarta",
      language: "id",
      maintenanceMode: false,
    },
    booking: {
      maxBookingDays: 30,
      minBookingHours: 2,
      cancellationHours: 24,
      autoConfirm: false,
      requirePayment: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminNotifications: true,
    },
    security: {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      requireEmailVerification: true,
      twoFactorAuth: false,
    },
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [backupStatus, setBackupStatus] = useState<"idle" | "backing-up" | "success" | "error">("idle")

  const handleSave = async (section: keyof SystemSettings) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackup = async () => {
    setBackupStatus("backing-up")
    try {
      // Simulate backup process
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setBackupStatus("success")
      setTimeout(() => setBackupStatus("idle"), 3000)
    } catch (error) {
      setBackupStatus("error")
      setTimeout(() => setBackupStatus("idle"), 3000)
    }
  }

  const handleRestore = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".sql,.json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        alert(`Memulai restore dari file: ${file.name}`)
      }
    }
    input.click()
  }

  return (
    <AuthGuard requiredUserType="admin">
      <RoleBasedLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
              <p className="text-gray-600">Kelola konfigurasi dan pengaturan aplikasi</p>
            </div>
            {saved && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Tersimpan
              </Badge>
            )}
          </div>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Umum</TabsTrigger>
              <TabsTrigger value="booking">Booking</TabsTrigger>
              <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
              <TabsTrigger value="security">Keamanan</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Pengaturan Umum
                  </CardTitle>
                  <CardDescription>Konfigurasi dasar aplikasi dan informasi situs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siteName">Nama Situs</Label>
                      <Input
                        id="siteName"
                        value={settings.general.siteName}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            general: { ...prev.general, siteName: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email Kontak</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            general: { ...prev.general, contactEmail: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="siteDescription">Deskripsi Situs</Label>
                    <Textarea
                      id="siteDescription"
                      value={settings.general.siteDescription}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, siteDescription: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timezone">Zona Waktu</Label>
                      <Select
                        value={settings.general.timezone}
                        onValueChange={(value) =>
                          setSettings((prev) => ({
                            ...prev,
                            general: { ...prev.general, timezone: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                          <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                          <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Bahasa</Label>
                      <Select
                        value={settings.general.language}
                        onValueChange={(value) =>
                          setSettings((prev) => ({
                            ...prev,
                            general: { ...prev.general, language: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">Bahasa Indonesia</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="maintenanceMode">Mode Maintenance</Label>
                      <p className="text-sm text-gray-500">Aktifkan untuk menonaktifkan akses publik</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, maintenanceMode: checked },
                        }))
                      }
                    />
                  </div>

                  <Button onClick={() => handleSave("general")} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Menyimpan..." : "Simpan Pengaturan"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Pengaturan Booking
                  </CardTitle>
                  <CardDescription>Konfigurasi aturan dan batasan booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="maxBookingDays">Maksimal Booking (hari)</Label>
                      <Input
                        id="maxBookingDays"
                        type="number"
                        value={settings.booking.maxBookingDays}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            booking: { ...prev.booking, maxBookingDays: Number.parseInt(e.target.value) },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="minBookingHours">Minimal Durasi (jam)</Label>
                      <Input
                        id="minBookingHours"
                        type="number"
                        value={settings.booking.minBookingHours}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            booking: { ...prev.booking, minBookingHours: Number.parseInt(e.target.value) },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="cancellationHours">Batas Pembatalan (jam)</Label>
                      <Input
                        id="cancellationHours"
                        type="number"
                        value={settings.booking.cancellationHours}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            booking: { ...prev.booking, cancellationHours: Number.parseInt(e.target.value) },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="autoConfirm">Konfirmasi Otomatis</Label>
                        <p className="text-sm text-gray-500">Booking dikonfirmasi otomatis tanpa persetujuan admin</p>
                      </div>
                      <Switch
                        id="autoConfirm"
                        checked={settings.booking.autoConfirm}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            booking: { ...prev.booking, autoConfirm: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="requirePayment">Wajib Pembayaran</Label>
                        <p className="text-sm text-gray-500">Booking harus disertai pembayaran</p>
                      </div>
                      <Switch
                        id="requirePayment"
                        checked={settings.booking.requirePayment}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            booking: { ...prev.booking, requirePayment: checked },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave("booking")} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Menyimpan..." : "Simpan Pengaturan"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Pengaturan Notifikasi
                  </CardTitle>
                  <CardDescription>Konfigurasi sistem notifikasi dan pemberitahuan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="emailNotifications">Notifikasi Email</Label>
                        <p className="text-sm text-gray-500">Kirim notifikasi melalui email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, emailNotifications: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="smsNotifications">Notifikasi SMS</Label>
                        <p className="text-sm text-gray-500">Kirim notifikasi melalui SMS</p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={settings.notifications.smsNotifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, smsNotifications: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Kirim notifikasi push ke browser</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, pushNotifications: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="adminNotifications">Notifikasi Admin</Label>
                        <p className="text-sm text-gray-500">Kirim notifikasi ke admin untuk aktivitas penting</p>
                      </div>
                      <Switch
                        id="adminNotifications"
                        checked={settings.notifications.adminNotifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, adminNotifications: checked },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave("notifications")} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Menyimpan..." : "Simpan Pengaturan"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Pengaturan Keamanan
                  </CardTitle>
                  <CardDescription>Konfigurasi keamanan dan autentikasi sistem</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (menit)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: { ...prev.security, sessionTimeout: Number.parseInt(e.target.value) },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxLoginAttempts">Maksimal Percobaan Login</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: { ...prev.security, maxLoginAttempts: Number.parseInt(e.target.value) },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="requireEmailVerification">Verifikasi Email Wajib</Label>
                        <p className="text-sm text-gray-500">Pengguna harus memverifikasi email sebelum login</p>
                      </div>
                      <Switch
                        id="requireEmailVerification"
                        checked={settings.security.requireEmailVerification}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: { ...prev.security, requireEmailVerification: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Aktifkan 2FA untuk keamanan tambahan</p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={settings.security.twoFactorAuth}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: { ...prev.security, twoFactorAuth: checked },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave("security")} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Menyimpan..." : "Simpan Pengaturan"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Backup Database
                    </CardTitle>
                    <CardDescription>Backup dan restore data sistem</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Backup Otomatis</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Backup otomatis dilakukan setiap hari pada pukul 02:00 WIB
                      </p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800">Aktif</Badge>
                    </div>

                    <div className="space-y-2">
                      <Button onClick={handleBackup} disabled={backupStatus === "backing-up"} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        {backupStatus === "backing-up" ? "Membuat Backup..." : "Buat Backup Manual"}
                      </Button>

                      <Button variant="outline" onClick={handleRestore} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Restore dari File
                      </Button>
                    </div>

                    {backupStatus === "success" && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm text-green-800">Backup berhasil dibuat</span>
                        </div>
                      </div>
                    )}

                    {backupStatus === "error" && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                          <span className="text-sm text-red-800">Gagal membuat backup</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HardDrive className="h-5 w-5 mr-2" />
                      System Logs
                    </CardTitle>
                    <CardDescription>Log aktivitas dan error sistem</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Application Logs</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Error Logs</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Access Logs</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-yellow-50">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-800">Log files akan dihapus otomatis setelah 30 hari</span>
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
