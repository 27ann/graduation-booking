"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Users, Search, Filter } from "lucide-react"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"

interface PhotoSpot {
  sp_id: number
  sp_name: string
  sp_location: string
  sp_desc: string
  sp_capacity: number
  sp_price_per_session: number
  sp_facilities: string
  total_bookings: number
  avg_booking_price: number
}

export default function PhotoSpotsPage() {
  const [photoSpots, setPhotoSpots] = useState<PhotoSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [maxPrice, setMaxPrice] = useState("50000")
  const [minCapacity, setMinCapacity] = useState("8")
  const [facilities, setFacilities] = useState("AC")

  const searchPhotoSpots = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/photo-spots/search?price=${maxPrice}&capacity=${minCapacity}&facilities=${facilities}`,
      )
      const data = await response.json()
      setPhotoSpots(data)
    } catch (error) {
      console.error("Error fetching photo spots:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    searchPhotoSpots()
  }, [])

  return (
    <AuthGuard requiredUserType={["student"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Lokasi Foto</h2>
            <p className="text-gray-600">Pilih lokasi foto terbaik di kampus ITS untuk sesi wisuda Anda</p>
          </div>

          {/* Search Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filter Pencarian
              </CardTitle>
              <CardDescription>Cari lokasi foto berdasarkan budget, kapasitas, dan fasilitas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="price">Harga Maksimal</Label>
                  <Select value={maxPrice} onValueChange={setMaxPrice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30000">Rp 30.000</SelectItem>
                      <SelectItem value="50000">Rp 50.000</SelectItem>
                      <SelectItem value="80000">Rp 80.000</SelectItem>
                      <SelectItem value="100000">Rp 100.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Kapasitas Minimum</Label>
                  <Select value={minCapacity} onValueChange={setMinCapacity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 orang</SelectItem>
                      <SelectItem value="8">8 orang</SelectItem>
                      <SelectItem value="12">12 orang</SelectItem>
                      <SelectItem value="15">15 orang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="facilities">Fasilitas</Label>
                  <Select value={facilities} onValueChange={setFacilities}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="toilet">Toilet</SelectItem>
                      <SelectItem value="wifi">WiFi</SelectItem>
                      <SelectItem value="parkir">Area Parkir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={searchPhotoSpots} className="w-full">
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
              <p className="mt-4 text-gray-600">Mencari lokasi foto...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photoSpots.map((spot) => (
                <Card key={spot.sp_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt={spot.sp_name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <CardTitle className="text-lg">{spot.sp_name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {spot.sp_location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{spot.sp_desc}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Kapasitas</span>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="font-medium">{spot.sp_capacity} orang</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Harga per sesi</span>
                        <span className="font-medium text-blue-600">
                          Rp {spot.sp_price_per_session.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total booking</span>
                        <span className="font-medium">{spot.total_bookings || 0}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label className="text-sm font-medium mb-2 block">Fasilitas:</Label>
                      <div className="flex flex-wrap gap-1">
                        {spot.sp_facilities.split(", ").map((facility, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href={`/booking?spot=${spot.sp_id}`}>Pilih Lokasi Ini</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && photoSpots.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada lokasi tersedia</h3>
              <p className="text-gray-600 mb-4">Coba ubah filter pencarian untuk menemukan lokasi yang sesuai</p>
              <Button
                variant="outline"
                onClick={() => {
                  setMaxPrice("50000")
                  setMinCapacity("8")
                  setFacilities("AC")
                  searchPhotoSpots()
                }}
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      </RoleBasedLayout>
    </AuthGuard>
  )
}
