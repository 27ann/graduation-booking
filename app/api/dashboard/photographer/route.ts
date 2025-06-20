import { NextResponse } from "next/server"

// Mock photographer dashboard data
const mockPhotographerData = [
  {
    p_id: 1,
    photographer_name: "Studio Foto Kenzie",
    u_email: "foto.studio1@its.ac.id",
    u_phonenumber: "082111222333",
    p_specialty: "Graduation & Portrait",
    p_rating: 4.8,
    p_price_per_hour: 150000,
    p_experienceyears: 5,
    total_bookings: 8,
    confirmed_bookings: 6,
    total_revenue: 1820000,
    avg_booking_value: 303333,
    working_days: 6,
    available_schedules: 8,
    booking_rate_percentage: 75.0,
  },
  {
    p_id: 2,
    photographer_name: "Visual Art Studio",
    u_email: "foto.studio2@its.ac.id",
    u_phonenumber: "082111222334",
    p_specialty: "Wedding & Graduation",
    p_rating: 4.9,
    p_price_per_hour: 200000,
    p_experienceyears: 7,
    total_bookings: 2,
    confirmed_bookings: 2,
    total_revenue: 850000,
    avg_booking_value: 425000,
    working_days: 2,
    available_schedules: 8,
    booking_rate_percentage: 25.0,
  },
  {
    p_id: 3,
    photographer_name: "Moment Capture",
    u_email: "foto.studio3@its.ac.id",
    u_phonenumber: "082111222335",
    p_specialty: "Event & Portrait",
    p_rating: 4.5,
    p_price_per_hour: 120000,
    p_experienceyears: 3,
    total_bookings: 5,
    confirmed_bookings: 4,
    total_revenue: 1670000,
    avg_booking_value: 417500,
    working_days: 4,
    available_schedules: 8,
    booking_rate_percentage: 50.0,
  },
  {
    p_id: 4,
    photographer_name: "ITS Photo Pro",
    u_email: "foto.studio4@its.ac.id",
    u_phonenumber: "082111222336",
    p_specialty: "Professional Portrait",
    p_rating: 4.7,
    p_price_per_hour: 180000,
    p_experienceyears: 8,
    total_bookings: 10,
    confirmed_bookings: 8,
    total_revenue: 3200000,
    avg_booking_value: 400000,
    working_days: 7,
    available_schedules: 8,
    booking_rate_percentage: 100.0,
  },
  {
    p_id: 5,
    photographer_name: "Campus Memory",
    u_email: "foto.studio5@its.ac.id",
    u_phonenumber: "082111222337",
    p_specialty: "Graduation & Campus Life",
    p_rating: 4.6,
    p_price_per_hour: 130000,
    p_experienceyears: 4,
    total_bookings: 5,
    confirmed_bookings: 5,
    total_revenue: 1200000,
    avg_booking_value: 240000,
    working_days: 4,
    available_schedules: 8,
    booking_rate_percentage: 62.5,
  },
]

export async function GET() {
  return NextResponse.json(mockPhotographerData)
}
