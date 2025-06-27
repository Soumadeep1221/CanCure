"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Heart, LayoutDashboard, Calendar, Users, LogOut, Menu, X, Bell, BellRing } from "lucide-react"

interface Doctor {
  id: string
  name: string
  email: string
  specialization: string
  notifications?: Notification[]
}

interface Notification {
  id: string
  type: "appointment_accepted" | "appointment_rejected" | "appointment_request" | "prescription_received"
  title: string
  message: string
  timestamp: string
  read: boolean
  relatedId?: string
}

export default function DoctorNavigation() {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setDoctor(parsedUser)
      loadNotifications(parsedUser.id)
    }
  }, [])

  const loadNotifications = (doctorId: string) => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const currentDoctor = allUsers.find((u: any) => u.id === doctorId)
    if (currentDoctor && currentDoctor.notifications) {
      setNotifications(currentDoctor.notifications)
      setUnreadCount(currentDoctor.notifications.filter((n: Notification) => !n.read).length)
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const userIndex = allUsers.findIndex((u: any) => u.id === doctor?.id)

    if (userIndex !== -1) {
      const updatedNotifications = allUsers[userIndex].notifications.map((n: Notification) =>
        n.id === notificationId ? { ...n, read: true } : n,
      )
      allUsers[userIndex].notifications = updatedNotifications
      localStorage.setItem("allUsers", JSON.stringify(allUsers))

      // Update current user
      const updatedUser = { ...doctor!, notifications: updatedNotifications }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      setNotifications(updatedNotifications)
      setUnreadCount(updatedNotifications.filter((n: Notification) => !n.read).length)
    }
  }

  const markAllAsRead = () => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const userIndex = allUsers.findIndex((u: any) => u.id === doctor?.id)

    if (userIndex !== -1) {
      const updatedNotifications = allUsers[userIndex].notifications.map((n: Notification) => ({
        ...n,
        read: true,
      }))
      allUsers[userIndex].notifications = updatedNotifications
      localStorage.setItem("allUsers", JSON.stringify(allUsers))

      // Update current user
      const updatedUser = { ...doctor!, notifications: updatedNotifications }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      setNotifications(updatedNotifications)
      setUnreadCount(0)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const navItems = [
    { name: "Dashboard", href: "/doctor-dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/doctor-appointments", icon: Calendar },
    { name: "Patients", href: "/doctor-patients", icon: Users },
  ]

  const isActive = (href: string) => pathname === href

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  if (!doctor) return null

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CancerCare AI</span>
            <Badge className="bg-green-600 text-white text-xs">Doctor</Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.name}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-2 ${
                    isActive(item.href) ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              )
            })}
          </div>

          {/* User Menu & Notifications */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative text-white hover:bg-gray-800">
                  {unreadCount > 0 ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 w-80">
                <div className="flex items-center justify-between p-3 border-b border-gray-700">
                  <span className="text-white font-medium">Notifications</span>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-blue-400 hover:text-blue-300 text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`p-3 cursor-pointer ${
                            !notification.read ? "bg-blue-900/20" : ""
                          } text-gray-300 focus:bg-gray-700 focus:text-white`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? "bg-blue-400" : "bg-transparent"}`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatTimestamp(notification.timestamp)}</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-gray-800">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block">Dr. {doctor.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white">
                  <div className="flex flex-col">
                    <span className="font-medium">Dr. {doctor.name}</span>
                    <span className="text-sm text-gray-400">{doctor.specialization}</span>
                    <span className="text-sm text-gray-400">{doctor.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-gray-300 focus:bg-gray-700 focus:text-white cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:bg-gray-800"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.name}
                    variant={isActive(item.href) ? "default" : "ghost"}
                    onClick={() => {
                      router.push(item.href)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full justify-start gap-2 ${
                      isActive(item.href)
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
