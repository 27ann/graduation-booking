import { type NextRequest, NextResponse } from "next/server"

// Mock users database
const mockUsers = [
  {
    id: 1,
    username: "ahmad_rizky",
    email: "ahmad.rizky.2021@student.its.ac.id",
    password: "password123", // In real app, this would be hashed
    fullName: "Ahmad Rizky Pratama",
    phoneNumber: "081234567890",
    userType: "student",
    isActive: true,
  },
  {
    id: 19,
    username: "photographer_1",
    email: "foto.studio1@its.ac.id",
    password: "password123",
    fullName: "Studio Foto Kenzie",
    phoneNumber: "082111222333",
    userType: "photographer",
    isActive: true,
  },
  {
    id: 24,
    username: "admin_its",
    email: "admin.foto@its.ac.id",
    password: "password123",
    fullName: "Admin Sistem Foto",
    phoneNumber: "082111222338",
    userType: "admin",
    isActive: true,
  },
  // Add more mock users
  {
    id: 2,
    username: "sari_indah",
    email: "sari.indah.2021@student.its.ac.id",
    password: "password123",
    fullName: "Sari Indah Permata",
    phoneNumber: "081234567891",
    userType: "student",
    isActive: true,
  },
  {
    id: 20,
    username: "photographer_2",
    email: "foto.studio2@its.ac.id",
    password: "password123",
    fullName: "Visual Art Studio",
    phoneNumber: "082111222334",
    userType: "photographer",
    isActive: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user by email
    const user = mockUsers.find((u) => u.email === email && u.isActive)

    if (!user) {
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 401 })
    }

    // Check password (in real app, use bcrypt.compare)
    if (user.password !== password) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Login berhasil",
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
