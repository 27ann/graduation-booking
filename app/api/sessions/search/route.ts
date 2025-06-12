import { type NextRequest, NextResponse } from "next/server"

// Mock photo sessions data - tanpa tanggal tetap
const mockSessions = [
  {
    ps_id: 1,
    ps_name: "Sesi Wisuda Pagi",
    ps_starttime: "08:00:00",
    ps_endtime: "10:00:00",
    ps_status: "available",
    max_participants: 10,
    avg_price: 350000,
    description: "Sesi foto wisuda pagi dengan pencahayaan natural terbaik",
    category: "wisuda",
  },
  {
    ps_id: 2,
    ps_name: "Sesi Wisuda Siang",
    ps_starttime: "13:00:00",
    ps_endtime: "15:00:00",
    ps_status: "available",
    max_participants: 10,
    avg_price: 425000,
    description: "Sesi foto wisuda siang yang ideal untuk foto formal",
    category: "wisuda",
  },
  {
    ps_id: 3,
    ps_name: "Sesi Wisuda Sore",
    ps_starttime: "16:00:00",
    ps_endtime: "18:00:00",
    ps_status: "available",
    max_participants: 10,
    avg_price: 300000,
    description: "Sesi foto wisuda sore dengan suasana golden hour",
    category: "wisuda",
  },
  {
    ps_id: 4,
    ps_name: "Sesi Pre-Graduation",
    ps_starttime: "09:00:00",
    ps_endtime: "12:00:00",
    ps_status: "available",
    max_participants: 8,
    avg_price: 420000,
    description: "Sesi foto pre-graduation untuk persiapan wisuda",
    category: "pre-graduation",
  },
  {
    ps_id: 5,
    ps_name: "Sesi Group Photo",
    ps_starttime: "09:00:00",
    ps_endtime: "12:00:00",
    ps_status: "available",
    max_participants: 15,
    avg_price: 500000,
    description: "Sesi foto group untuk organisasi atau jurusan",
    category: "group",
  },
  {
    ps_id: 6,
    ps_name: "Sesi Individual Portrait",
    ps_starttime: "13:00:00",
    ps_endtime: "16:00:00",
    ps_status: "available",
    max_participants: 1,
    avg_price: 360000,
    description: "Sesi foto individual dengan berbagai pose dan lokasi",
    category: "individual",
  },
  {
    ps_id: 7,
    ps_name: "Sesi Family Portrait",
    ps_starttime: "08:00:00",
    ps_endtime: "11:00:00",
    ps_status: "available",
    max_participants: 5,
    avg_price: 410000,
    description: "Sesi foto keluarga untuk momen wisuda bersama",
    category: "family",
  },
  {
    ps_id: 8,
    ps_name: "Sesi Professional Headshot",
    ps_starttime: "14:00:00",
    ps_endtime: "17:00:00",
    ps_status: "available",
    max_participants: 3,
    avg_price: 450000,
    description: "Sesi foto professional untuk keperluan karir",
    category: "professional",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date")
  const status = searchParams.get("status") || "all"
  const type = searchParams.get("type") || "all"

  let filteredSessions = mockSessions

  // Filter by status
  if (status !== "all") {
    filteredSessions = filteredSessions.filter((session) => session.ps_status === status)
  }

  // Filter by type/category
  if (type !== "all") {
    filteredSessions = filteredSessions.filter((session) => session.category === type)
  }

  // Add availability info based on selected date (mock data)
  const sessionsWithAvailability = filteredSessions.map((session) => {
    // Mock availability calculation based on date
    const selectedDate = date ? new Date(date) : new Date()
    const dayOfWeek = selectedDate.getDay()

    // Simulate different availability based on day
    let available_spots = session.max_participants
    let total_bookings = 0

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend
      available_spots = Math.max(0, session.max_participants - Math.floor(Math.random() * 3))
      total_bookings = session.max_participants - available_spots
    } else {
      // Weekday
      available_spots = Math.max(0, session.max_participants - Math.floor(Math.random() * 5))
      total_bookings = session.max_participants - available_spots
    }

    return {
      ...session,
      available_spots,
      total_bookings,
      selected_date: date,
    }
  })

  return NextResponse.json(sessionsWithAvailability)
}
