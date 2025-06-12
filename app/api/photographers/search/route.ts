import { type NextRequest, NextResponse } from "next/server"

// Mock database connection - in real app, use your database
const mockPhotographers = [
  {
    p_id: 1,
    photographer_name: "Studio Foto Kenzie",
    u_email: "foto.studio1@its.ac.id",
    u_phonenumber: "082111222333",
    p_specialty: "Graduation & Portrait",
    p_rating: 4.8,
    p_price_per_hour: 150000,
    p_experienceyears: 5,
    p_portfoliourl: "https://portfolio.kenzie-studio.com",
    s_date: "2024-06-15",
    s_starttime: "08:00:00",
    s_endtime: "18:00:00",
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
    p_portfoliourl: "https://portfolio.visualart.com",
    s_date: "2024-06-15",
    s_starttime: "09:00:00",
    s_endtime: "19:00:00",
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
    p_portfoliourl: "https://portfolio.momentcapture.com",
    s_date: "2024-06-15",
    s_starttime: "09:00:00",
    s_endtime: "17:00:00",
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
    p_portfoliourl: "https://portfolio.itsphoto.com",
    s_date: "2024-06-16",
    s_starttime: "10:00:00",
    s_endtime: "18:00:00",
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
    p_portfoliourl: "https://portfolio.campusmemory.com",
    s_date: "2024-06-15",
    s_starttime: "11:00:00",
    s_endtime: "19:00:00",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date") || "2024-06-15"
  const rating = Number.parseFloat(searchParams.get("rating") || "4.0")
  const price = Number.parseInt(searchParams.get("price") || "200000")

  // Filter photographers based on search criteria
  const filteredPhotographers = mockPhotographers.filter((photographer) => {
    return photographer.s_date === date && photographer.p_rating >= rating && photographer.p_price_per_hour <= price
  })

  return NextResponse.json(filteredPhotographers)
}
