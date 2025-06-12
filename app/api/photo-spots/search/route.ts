import { type NextRequest, NextResponse } from "next/server"

// Mock photo spots data
const mockPhotoSpots = [
  {
    sp_id: 1,
    sp_name: "Gedung Rektorat ITS",
    sp_location: "Jl. Arief Rahman Hakim, Sukolilo",
    sp_desc: "Gedung ikonik ITS dengan arsitektur modern, cocok untuk foto formal wisuda",
    sp_capacity: 10,
    sp_price_per_session: 50000,
    sp_facilities: "Ruang tunggu, toilet, area parkir",
    total_bookings: 15,
    avg_booking_price: 350000,
  },
  {
    sp_id: 2,
    sp_name: "Perpustakaan Pusat ITS",
    sp_location: "Kampus ITS Sukolilo",
    sp_desc: "Perpustakaan megah dengan desain arsitektur menarik",
    sp_capacity: 8,
    sp_price_per_session: 40000,
    sp_facilities: "AC, toilet, area baca",
    total_bookings: 12,
    avg_booking_price: 320000,
  },
  {
    sp_id: 3,
    sp_name: "Taman Teknologi ITS",
    sp_location: "Area Tengah Kampus ITS",
    sp_desc: "Taman luas dengan spot foto natural dan modern",
    sp_capacity: 15,
    sp_price_per_session: 30000,
    sp_facilities: "Bangku taman, gazebo, lampu taman",
    total_bookings: 20,
    avg_booking_price: 280000,
  },
  {
    sp_id: 4,
    sp_name: "Masjid Manarul Ilmi ITS",
    sp_location: "Kampus ITS Sukolilo",
    sp_desc: "Masjid kampus dengan arsitektur Islami yang indah",
    sp_capacity: 12,
    sp_price_per_session: 35000,
    sp_facilities: "Tempat wudhu, sound system, AC",
    total_bookings: 8,
    avg_booking_price: 300000,
  },
  {
    sp_id: 5,
    sp_name: "Student Center ITS",
    sp_location: "Area Tengah Kampus",
    sp_desc: "Pusat kegiatan mahasiswa dengan suasana modern",
    sp_capacity: 15,
    sp_price_per_session: 35000,
    sp_facilities: "Food court, ruang meeting, wifi",
    total_bookings: 18,
    avg_booking_price: 310000,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const price = Number.parseInt(searchParams.get("price") || "50000")
  const capacity = Number.parseInt(searchParams.get("capacity") || "8")
  const facilities = searchParams.get("facilities") || "AC"

  // Filter photo spots based on search criteria
  const filteredSpots = mockPhotoSpots.filter((spot) => {
    return (
      spot.sp_price_per_session <= price &&
      spot.sp_capacity >= capacity &&
      spot.sp_facilities.toLowerCase().includes(facilities.toLowerCase())
    )
  })

  return NextResponse.json(filteredSpots)
}
