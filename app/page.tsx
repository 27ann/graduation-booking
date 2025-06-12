"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, Users, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth-guard"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      if (user.type === "student") {
        router.push("/dashboard/student")
      } else if (user.type === "photographer") {
        router.push("/dashboard/photographer")
      } else if (user.type === "admin") {
        router.push("/dashboard/admin")
      }
    }
  }, [user, isLoading, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  // If user is logged in, we'll redirect in the useEffect
  // This is the landing page for non-logged in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ITS Graduation Photo</h1>
            </div>
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
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Abadikan Momen Wisuda Anda di ITS</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistem booking foto wisuda terpercaya dengan fotografer profesional dan lokasi terbaik di kampus ITS.
            Wujudkan foto wisuda impian Anda dengan mudah dan berkualitas tinggi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/photographers">
                <Camera className="mr-2 h-5 w-5" />
                Cari Fotografer
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/photo-spots">
                <MapPin className="mr-2 h-5 w-5" />
                Lihat Lokasi Foto
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Mengapa Memilih Kami?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Fotografer Profesional</CardTitle>
                <CardDescription>
                  5 fotografer berpengalaman dengan rating tinggi dan spesialisasi foto wisuda
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>25+ Lokasi Foto</CardTitle>
                <CardDescription>
                  Berbagai spot foto ikonik di kampus ITS, dari Gedung Rektorat hingga Taman Teknologi
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Booking Mudah</CardTitle>
                <CardDescription>
                  Sistem booking online yang mudah dengan validasi otomatis dan konfirmasi real-time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-100">Lokasi Foto</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-blue-100">Fotografer Profesional</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30+</div>
              <div className="text-blue-100">Booking Berhasil</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.7</div>
              <div className="text-blue-100">Rating Rata-rata</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Spots Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Lokasi Foto Populer</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Gedung Rektorat ITS"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle>Gedung Rektorat ITS</CardTitle>
                <CardDescription>
                  Gedung ikonik ITS dengan arsitektur modern, cocok untuk foto formal wisuda
                </CardDescription>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant="secondary">Kapasitas: 10 orang</Badge>
                  <span className="font-semibold text-blue-600">Rp 50.000</span>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Perpustakaan Pusat ITS"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle>Perpustakaan Pusat ITS</CardTitle>
                <CardDescription>Perpustakaan megah dengan desain arsitektur menarik</CardDescription>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant="secondary">Kapasitas: 8 orang</Badge>
                  <span className="font-semibold text-blue-600">Rp 40.000</span>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Taman Teknologi ITS"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle>Taman Teknologi ITS</CardTitle>
                <CardDescription>Taman luas dengan spot foto natural dan modern</CardDescription>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant="secondary">Kapasitas: 15 orang</Badge>
                  <span className="font-semibold text-blue-600">Rp 30.000</span>
                </div>
              </CardHeader>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/photo-spots">Lihat Semua Lokasi</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Siap Untuk Booking Foto Wisuda Anda?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Jangan sampai kehabisan slot! Booking sekarang dan dapatkan foto wisuda terbaik dengan fotografer
            profesional.
          </p>
          <Button size="lg" asChild>
            <Link href="/photographers">Mulai Booking Sekarang</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="h-6 w-6" />
                <span className="text-lg font-semibold">ITS Graduation Photo</span>
              </div>
              <p className="text-gray-400">Sistem booking foto wisuda terpercaya untuk mahasiswa ITS</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/photographers">Fotografer</Link>
                </li>
                <li>
                  <Link href="/photo-spots">Lokasi Foto</Link>
                </li>
                <li>
                  <Link href="/sessions">Sesi Foto</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Akun</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/register">Daftar</Link>
                </li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: admin.foto@its.ac.id</li>
                <li>Phone: (031) 123-4567</li>
                <li>ITS Sukolilo, Surabaya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ITS Graduation Photo Booking System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
