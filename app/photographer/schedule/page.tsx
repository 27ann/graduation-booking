"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface ScheduleItem {
  id: number
  date: string
  startTime: string
  endTime: string
  status: "available" | "booked" | "blocked"
  title?: string
  clientName?: string
  sessionType?: string
  price?: number
}

export default function PhotographerSchedulePage() {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [showCalendarView, setShowCalendarView] = useState(false)
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false)
  const [showEditSlotDialog, setShowEditSlotDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<ScheduleItem | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())

  const [newSlot, setNewSlot] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "12:00",
    status: "available" as const,
    title: "",
  })

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // Mock data untuk jadwal fotografer
        const mockSchedule: ScheduleItem[] = [
          {
            id: 1,
            date: "2024-06-15",
            startTime: "08:00",
            endTime: "10:00",
            status: "booked",
            title: "Sesi Wisuda Pagi",
            clientName: "Ahmad Rizky Pratama",
            sessionType: "Graduation",
            price: 350000,
          },
          {
            id: 2,
            date: "2024-06-15",
            startTime: "13:00",
            endTime: "16:00",
            status: "available",
          },
          {
            id: 3,
            date: "2024-06-16",
            startTime: "09:00",
            endTime: "12:00",
            status: "booked",
            title: "Family Portrait",
            clientName: "Sari Indah Permata",
            sessionType: "Family",
            price: 450000,
          },
          {
            id: 4,
            date: "2024-06-16",
            startTime: "14:00",
            endTime: "17:00",
            status: "blocked",
            title: "Personal Time",
          },
        ]

        setSchedule(mockSchedule)
      } catch (error) {
        console.error("Error fetching schedule:", error)
      }
      setLoading(false)
    }

    fetchSchedule()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "booked":
        return "bg-blue-100 text-blue-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Tersedia"
      case "booked":
        return "Terboking"
      case "blocked":
        return "Tidak Tersedia"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "booked":
        return <CalendarIcon className="h-4 w-4 text-blue-600" />
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const handleAddSlot = () => {
    const newId = Math.max(0, ...schedule.map((item) => item.id)) + 1
    const newScheduleItem: ScheduleItem = {
      id: newId,
      date: newSlot.date,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      status: newSlot.status,
      title: newSlot.title || undefined,
    }

    setSchedule([...schedule, newScheduleItem])
    setShowAddSlotDialog(false)
    setNewSlot({
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "12:00",
      status: "available",
      title: "",
    })
  }

  const handleEditSlot = () => {
    if (!selectedSlot) return

    setSchedule(
      schedule.map((item) => {
        if (item.id === selectedSlot.id) {
          return selectedSlot
        }
        return item
      }),
    )
    setShowEditSlotDialog(false)
    setSelectedSlot(null)
  }

  const handleDeleteSlot = () => {
    if (!selectedSlot) return

    setSchedule(schedule.filter((item) => item.id !== selectedSlot.id))
    setShowDeleteConfirm(false)
    setSelectedSlot(null)
  }

  const openEditDialog = (slot: ScheduleItem) => {
    setSelectedSlot(slot)
    setShowEditSlotDialog(true)
  }

  const openDeleteConfirm = (slot: ScheduleItem) => {
    setSelectedSlot(slot)
    setShowDeleteConfirm(true)
  }

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat jadwal...</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Jadwal Saya</h2>
            <p className="text-gray-600">Kelola ketersediaan dan jadwal booking Anda</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 flex space-x-4">
            <Button onClick={() => setShowAddSlotDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Slot Tersedia
            </Button>
            <Button variant="outline" onClick={() => setShowCalendarView(!showCalendarView)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              {showCalendarView ? "Lihat Daftar" : "Lihat Kalender"}
            </Button>
          </div>

          {/* Calendar View */}
          {showCalendarView ? (
            <Card>
              <CardHeader>
                <CardTitle>Kalender Jadwal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                      <div key={day} className="bg-white p-2 text-center font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {Array.from({ length: 35 }).map((_, i) => {
                      const day = i + 1
                      const hasEvents = schedule.some((item) => {
                        const itemDate = new Date(item.date)
                        return itemDate.getDate() === day && itemDate.getMonth() === new Date().getMonth()
                      })

                      return (
                        <div
                          key={i}
                          className={`bg-white p-2 min-h-[80px] ${
                            day <= 30 ? "cursor-pointer hover:bg-gray-50" : "opacity-50"
                          }`}
                        >
                          {day <= 30 && (
                            <>
                              <div className="font-medium">{day}</div>
                              {hasEvents && (
                                <div className="mt-1">
                                  {schedule
                                    .filter((item) => {
                                      const itemDate = new Date(item.date)
                                      return itemDate.getDate() === day && itemDate.getMonth() === new Date().getMonth()
                                    })
                                    .map((event) => (
                                      <div
                                        key={event.id}
                                        className={`text-xs p-1 mb-1 rounded truncate ${
                                          event.status === "booked"
                                            ? "bg-blue-100 text-blue-800"
                                            : event.status === "blocked"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {event.startTime} - {event.title || "Tersedia"}
                                      </div>
                                    ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Schedule List */
            <div className="space-y-4">
              {schedule.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">
                              {item.title || `Slot ${item.startTime} - ${item.endTime}`}
                            </h3>
                            <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                              <span>{new Date(item.date).toLocaleDateString("id-ID")}</span>
                              <span>
                                {item.startTime} - {item.endTime}
                              </span>
                              {item.clientName && <span>Client: {item.clientName}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.price && (
                          <span className="font-semibold text-blue-600">Rp {item.price.toLocaleString("id-ID")}</span>
                        )}
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openDeleteConfirm(item)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {schedule.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada jadwal</h3>
                    <p className="text-gray-600 mb-4">Tambahkan slot ketersediaan Anda untuk mulai menerima booking</p>
                    <Button onClick={() => setShowAddSlotDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Slot Tersedia
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Add Slot Dialog */}
          <Dialog open={showAddSlotDialog} onOpenChange={setShowAddSlotDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Slot Tersedia</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newSlot.date ? format(new Date(newSlot.date), "PPP") : <span>Pilih tanggal</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date)
                          if (date) {
                            setNewSlot({
                              ...newSlot,
                              date: format(date, "yyyy-MM-dd"),
                            })
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Waktu Mulai</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Waktu Selesai</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newSlot.status}
                    onValueChange={(value) => setNewSlot({ ...newSlot, status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Tersedia</SelectItem>
                      <SelectItem value="blocked">Tidak Tersedia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Judul (Opsional)</Label>
                  <Input
                    id="title"
                    value={newSlot.title}
                    onChange={(e) => setNewSlot({ ...newSlot, title: e.target.value })}
                    placeholder="Contoh: Sesi Foto Wisuda"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddSlotDialog(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddSlot}>Tambah Slot</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Slot Dialog */}
          <Dialog open={showEditSlotDialog} onOpenChange={setShowEditSlotDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Slot</DialogTitle>
              </DialogHeader>
              {selectedSlot && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Tanggal</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={selectedSlot.date}
                      onChange={(e) =>
                        setSelectedSlot({
                          ...selectedSlot,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-startTime">Waktu Mulai</Label>
                      <Input
                        id="edit-startTime"
                        type="time"
                        value={selectedSlot.startTime}
                        onChange={(e) =>
                          setSelectedSlot({
                            ...selectedSlot,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-endTime">Waktu Selesai</Label>
                      <Input
                        id="edit-endTime"
                        type="time"
                        value={selectedSlot.endTime}
                        onChange={(e) =>
                          setSelectedSlot({
                            ...selectedSlot,
                            endTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={selectedSlot.status}
                      onValueChange={(value) =>
                        setSelectedSlot({
                          ...selectedSlot,
                          status: value as any,
                        })
                      }
                      disabled={selectedSlot.status === "booked"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Tersedia</SelectItem>
                        <SelectItem value="blocked">Tidak Tersedia</SelectItem>
                        {selectedSlot.status === "booked" && <SelectItem value="booked">Terboking</SelectItem>}
                      </SelectContent>
                    </Select>
                    {selectedSlot.status === "booked" && (
                      <p className="text-xs text-amber-600">
                        Slot yang sudah terboking tidak dapat diubah statusnya. Hubungi admin untuk pembatalan.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Judul (Opsional)</Label>
                    <Input
                      id="edit-title"
                      value={selectedSlot.title || ""}
                      onChange={(e) =>
                        setSelectedSlot({
                          ...selectedSlot,
                          title: e.target.value,
                        })
                      }
                      placeholder="Contoh: Sesi Foto Wisuda"
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditSlotDialog(false)}>
                  Batal
                </Button>
                <Button onClick={handleEditSlot}>Simpan Perubahan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus Slot</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p>
                  Apakah Anda yakin ingin menghapus slot ini?{" "}
                  {selectedSlot?.status === "booked" && (
                    <span className="text-red-600 font-semibold">
                      Slot ini sudah terboking dan penghapusan akan membatalkan booking.
                    </span>
                  )}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Batal
                </Button>
                <Button variant="destructive" onClick={handleDeleteSlot}>
                  Hapus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollToTop />
      </RoleBasedLayout>
    </AuthGuard>
  )
}
