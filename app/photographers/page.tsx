"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Clock, Search, Filter } from "lucide-react"
import { RoleBasedLayout } from "@/components/role-based-layout"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"

interface Photographer {
  p_id: number
  photographer_name: string
  u_email: string
  u_phonenumber: string
  p_specialty: string
  p_rating: number
  p_price_per_hour: number
  p_experienceyears: number
  p_portfoliourl: string
  s_date: string
  s_starttime: string
  s_endtime: string
}

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchDate, setSearchDate] = useState("2024-06-15")
  const [minRating, setMinRating] = useState("4.0")
  const [maxPrice, setMaxPrice] = useState("200000")

  const searchPhotographers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/photographers/search?date=${searchDate}&rating=${minRating}&price=${maxPrice}`)
      const data = await response.json()
      setPhotographers(data)
    } catch (error) {
      console.error("Error fetching photographers:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    searchPhotographers()
  }, [])

  return (
    <AuthGuard requiredUserType={["student"]}>
      <RoleBasedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Cari Fotografer</h2>
            <p className="text-gray-600">Temukan fotografer profesional yang tersedia sesuai kebutuhan Anda</p>
          </div>

          {/* Search Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filter Pencarian
              </CardTitle>
              <CardDescription>Gunakan filter di bawah untuk mencari fotografer yang tersedia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="date">Tanggal</Label>
                  <Input id="date" type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="rating">Rating Minimum</Label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3.0">3.0+</SelectItem>
                      <SelectItem value="4.0">4.0+</SelectItem>
                      <SelectItem value="4.5">4.5+</SelectItem>
                      <SelectItem value="4.8">4.8+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Harga Maksimal</Label>
                  <Select value={maxPrice} onValueChange={setMaxPrice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="150000">Rp 150.000</SelectItem>
                      <SelectItem value="200000">Rp 200.000</SelectItem>
                      <SelectItem value="250000">Rp 250.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={searchPhotographers} className="w-full">
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
              <p className="mt-4 text-gray-600">Mencari fotografer...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photographers.map((photographer) => (
                <Card key={photographer.p_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{photographer.photographer_name}</CardTitle>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{photographer.p_rating}</span>
                      </div>
                    </div>
                    <CardDescription>{photographer.p_specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pengalaman</span>
                        <span className="font-medium">{photographer.p_experienceyears} tahun</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Harga per jam</span>
                        <span className="font-medium text-blue-600">
                          Rp {photographer.p_price_per_hour.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tersedia</span>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1 text-green-600" />
                          {photographer.s_starttime} - {photographer.s_endtime}
                        </div>
                      </div>
                      <div className="pt-2">
                        <Badge variant="outline" className="mb-2">
                          {photographer.u_email}
                        </Badge>
                        <br />
                        <Badge variant="outline">{photographer.u_phonenumber}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={photographer.p_portfoliourl} target="_blank" rel="noopener noreferrer">
                          Portfolio
                        </a>
                      </Button>
                      <Button size="sm" asChild className="flex-1">
                        <Link href={`/booking?photographer=${photographer.p_id}&date=${searchDate}`}>Book Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && photographers.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada fotografer tersedia</h3>
              <p className="text-gray-600 mb-4">Coba ubah filter pencarian atau pilih tanggal lain</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchDate("2024-06-15")
                  setMinRating("4.0")
                  setMaxPrice("200000")
                  searchPhotographers()
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
