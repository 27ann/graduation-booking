"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Camera,
  Calendar,
  User,
  LogOut,
  Menu,
  Home,
  BookOpen,
  MapPin,
  Users,
  Settings,
  BarChart3,
  ImageIcon,
  Clock,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  userTypes: string[]
  children?: NavItem[]
  expanded?: boolean
}

export function RoleBasedLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [navItems, setNavItems] = useState<NavItem[]>([])

  // Fungsi untuk toggle expanded state pada item dengan children
  const toggleExpanded = (index: number) => {
    setNavItems((prev) => prev.map((item, i) => (i === index ? { ...item, expanded: !item.expanded } : item)))
  }

  // Inisialisasi item navigasi berdasarkan user type
  useEffect(() => {
    if (!user) return

    const items: NavItem[] = [
      {
        title: "Dashboard",
        href:
          user.type === "admin"
            ? "/dashboard/admin"
            : user.type === "photographer"
              ? "/dashboard/photographer"
              : "/dashboard/student",
        icon: <Home className="h-5 w-5" />,
        userTypes: ["student", "photographer", "admin"],
      },
      {
        title: "Booking Saya",
        href: "/my-bookings",
        icon: <Calendar className="h-5 w-5" />,
        userTypes: ["student"],
      },
      {
        title: "Fotografer",
        href: "/photographers",
        icon: <Camera className="h-5 w-5" />,
        userTypes: ["student"],
      },
      {
        title: "Lokasi Foto",
        href: "/photo-spots",
        icon: <MapPin className="h-5 w-5" />,
        userTypes: ["student"],
      },
      {
        title: "Sesi Foto",
        href: "/sessions",
        icon: <Clock className="h-5 w-5" />,
        userTypes: ["student"],
      },
      // Photographer menu items
      {
        title: "Booking",
        href: "/photographer/bookings",
        icon: <Calendar className="h-5 w-5" />,
        userTypes: ["photographer"],
      },
      {
        title: "Portfolio",
        href: "/photographer/portfolio",
        icon: <ImageIcon className="h-5 w-5" />,
        userTypes: ["photographer"],
      },
      {
        title: "Jadwal",
        href: "/photographer/schedule",
        icon: <Clock className="h-5 w-5" />,
        userTypes: ["photographer"],
      },
      {
        title: "Pendapatan",
        href: "/photographer/earnings",
        icon: <CreditCard className="h-5 w-5" />,
        userTypes: ["photographer"],
      },
      {
        title: "Profil",
        href: "/photographer/profile",
        icon: <User className="h-5 w-5" />,
        userTypes: ["photographer"],
      },
      // Admin menu items
      {
        title: "Manajemen",
        href: "#",
        icon: <Settings className="h-5 w-5" />,
        userTypes: ["admin"],
        expanded: false,
        children: [
          {
            title: "Pengguna",
            href: "/admin/users",
            icon: <Users className="h-5 w-5" />,
            userTypes: ["admin"],
          },
          {
            title: "Fotografer",
            href: "/admin/photographers",
            icon: <Camera className="h-5 w-5" />,
            userTypes: ["admin"],
          },
          {
            title: "Booking",
            href: "/admin/bookings",
            icon: <BookOpen className="h-5 w-5" />,
            userTypes: ["admin"],
          },
          {
            title: "Lokasi Foto",
            href: "/admin/photo-spots",
            icon: <MapPin className="h-5 w-5" />,
            userTypes: ["admin"],
          },
          {
            title: "Sesi Foto",
            href: "/admin/sessions",
            icon: <Clock className="h-5 w-5" />,
            userTypes: ["admin"],
          },
        ],
      },
      {
        title: "Laporan",
        href: "/admin/reports",
        icon: <BarChart3 className="h-5 w-5" />,
        userTypes: ["admin"],
      },
      {
        title: "Pengaturan",
        href: "/admin/settings",
        icon: <Settings className="h-5 w-5" />,
        userTypes: ["admin"],
      },
    ]

    // Filter items based on user type
    const filteredItems = items.filter((item) => item.userTypes.includes(user.type))
    setNavItems(filteredItems)
  }, [user])

  // Determine if a nav item is active
  const isActive = (href: string) => {
    if (href === "#") return false
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Get user role color
  const getUserRoleColor = () => {
    switch (user?.type) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "photographer":
        return "bg-purple-100 text-purple-800"
      case "student":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get user role text
  const getUserRoleText = () => {
    switch (user?.type) {
      case "admin":
        return "Admin"
      case "photographer":
        return "Fotografer"
      case "student":
        return "Mahasiswa"
      default:
        return "User"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href={`/dashboard/${user.type}`} className="flex items-center space-x-2">
                <Camera className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-xl">ITS Graduation Photo</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Menu - Desktop */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <div className="flex flex-col h-full">
                    <div className="py-4 border-b">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={user?.avatar || ""} />
                          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.name || "User"}</p>
                          <div className="flex items-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getUserRoleColor()}`}>
                              {getUserRoleText()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <nav className="flex-1 py-4 overflow-y-auto">
                      <ul className="space-y-1">
                        {navItems.map((item, index) => (
                          <li key={item.title}>
                            {item.children ? (
                              <div>
                                <button
                                  onClick={() => toggleExpanded(index)}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                                    isActive(item.href) ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <span className="mr-3 text-gray-500">{item.icon}</span>
                                    {item.title}
                                  </div>
                                  {item.expanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                                {item.expanded && (
                                  <ul className="mt-1 pl-8 space-y-1">
                                    {item.children.map((child) => (
                                      <li key={child.title}>
                                        <Link
                                          href={child.href}
                                          className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                            isActive(child.href)
                                              ? "bg-blue-50 text-blue-700"
                                              : "text-gray-700 hover:bg-gray-100"
                                          }`}
                                          onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                          <span className="mr-3 text-gray-500">{child.icon}</span>
                                          {child.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ) : (
                              <Link
                                href={item.href}
                                className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                  isActive(item.href) ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span className="mr-3 text-gray-500">{item.icon}</span>
                                {item.title}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </nav>

                    <div className="py-4 border-t">
                      <Button variant="outline" className="w-full" onClick={logout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden md:block w-64 border-r bg-white h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          <div className="p-4">
            <div className="mb-4 px-3 py-2">
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getUserRoleColor()}`}>{getUserRoleText()}</span>
              </div>
            </div>
            <nav>
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <li key={item.title}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleExpanded(index)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                            isActive(item.href) ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="mr-3 text-gray-500">{item.icon}</span>
                            {item.title}
                          </div>
                          {item.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {item.expanded && (
                          <ul className="mt-1 pl-8 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.title}>
                                <Link
                                  href={child.href}
                                  className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                    isActive(child.href)
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <span className="mr-3 text-gray-500">{child.icon}</span>
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm rounded-md ${
                          isActive(item.href) ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span className="mr-3 text-gray-500">{item.icon}</span>
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
