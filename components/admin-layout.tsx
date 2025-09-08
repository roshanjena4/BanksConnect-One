"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Users, Building2, CreditCard, Settings, Menu, X, BarChart3, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { useSelector } from "react-redux"
import { persistor, RootState } from "@/app/store"
import { logout as logoutAction } from '@/lib/actions'
import { useRouter } from "next/navigation"
import ThemeToggleButton from "@/components/ui/theme-toggle-button"


interface AdminLayoutProps {
  children: ReactNode
}

const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Bank Management", href: "/admin/banks", icon: Building2 },
  { name: "Account Management", href: "/admin/accounts", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useSelector((state: RootState) => state.user.userData);
  const router = useRouter();
  const handleLogout = async () => {
    // console.log("logout");

    await logoutAction();
    // dispatch(logout());
    persistor.purge();
    router.push("/signin");
  }
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {sidebarOpen && (
        <div className="fixed inset-0  bg-white/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded flex items-center justify-center">
                <Image src="/symbol.png" alt="Next.js Logo" width={26} height={26} />
              </div>
              <div className="flex flex-col">
                <span className="lg:text-xl sm:text-lg font-semibold text-gray-900 dark:text-white">Next Bank</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <ThemeToggle /> */}
              <ThemeToggleButton />

              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search admin..."
              className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              {/* <AvatarImage src="/placeholder.svg?height=40&width=40" /> */}
              <AvatarFallback className="bg-red-600 text-white">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
            <button onClick={() => handleLogout()}>
              <LogOut className='w-5 h-5 text-blue-600 dark:text-blue-800 cursor-pointer' />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:ml-0">
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center">
                <Image src="/symbol.png" alt="Next.js Logo" width={26} height={26} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Next Bank</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Admin</span>
              </div>
            </div>
            {/* <ThemeToggle /> */}
            <ThemeToggleButton />

          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
