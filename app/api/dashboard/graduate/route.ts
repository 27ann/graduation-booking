import { NextResponse } from "next/server"

// Mock graduate dashboard data
const mockGraduateData = [
  {
    u_id: 1,
    graduate_name: "Ahmad Rizky Pratama",
    u_email: "ahmad.rizky.2021@student.its.ac.id",
    total_bookings: 3,
    confirmed_bookings: 2,
    pending_bookings: 1,
    cancelled_bookings: 0,
    total_spent: 670000,
    avg_booking_price: 335000,
    latest_booking_date: "2024-06-21",
    booked_sessions: "Sesi Wisuda Pagi - Batch 1, Sesi Casual Campus",
  },
  {
    u_id: 2,
    graduate_name: "Sari Indah Permata",
    u_email: "sari.indah.2021@student.its.ac.id",
    total_bookings: 2,
    confirmed_bookings: 2,
    pending_bookings: 0,
    cancelled_bookings: 0,
    total_spent: 1200000,
    avg_booking_price: 600000,
    latest_booking_date: "2024-06-22",
    booked_sessions: "Sesi Wisuda Siang - Batch 1, Sesi Final Graduation",
  },
  {
    u_id: 3,
    graduate_name: "Budi Santoso",
    u_email: "budi.santoso.2021@student.its.ac.id",
    total_bookings: 2,
    confirmed_bookings: 1,
    pending_bookings: 1,
    cancelled_bookings: 0,
    total_spent: 330000,
    avg_booking_price: 330000,
    latest_booking_date: "2024-06-15",
    booked_sessions: "Sesi Wisuda Sore - Batch 1",
  },
  {
    u_id: 4,
    graduate_name: "Maya Putri Sari",
    u_email: "maya.putri.2021@student.its.ac.id",
    total_bookings: 2,
    confirmed_bookings: 2,
    pending_bookings: 0,
    cancelled_bookings: 0,
    total_spent: 820000,
    avg_booking_price: 410000,
    latest_booking_date: "2024-06-16",
    booked_sessions: "Sesi Wisuda Pagi - Batch 2, Duo foto sahabat",
  },
  {
    u_id: 5,
    graduate_name: "Doni Kurniawan",
    u_email: "doni.kurniawan.2021@student.its.ac.id",
    total_bookings: 1,
    confirmed_bookings: 1,
    pending_bookings: 0,
    cancelled_bookings: 0,
    total_spent: 320000,
    avg_booking_price: 320000,
    latest_booking_date: "2024-06-16",
    booked_sessions: "Sesi Wisuda Siang - Batch 2",
  },
]

export async function GET() {
  return NextResponse.json(mockGraduateData)
}
