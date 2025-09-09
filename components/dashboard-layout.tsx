"use client"

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Home, CreditCard, History, Send, LinkIcon, LogOut,X, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
// import { ThemeToggle } from '@/components/theme-toggle'
import { useSelector } from 'react-redux'
import { persistor, RootState } from '@/app/store'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { logout as logoutAction } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import ThemeToggleButton from "@/components/ui/theme-toggle-button"
import FlipLink from "@/components/ui/text-effect-flipper"

interface User {
  id: number;
  username: string;
  Name: string;
  Email: string;
  email: string;
  token: string;
  role: string;
}



interface DashboardLayoutProps {
    children: ReactNode
}

const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'My Banks', href: '/my-banks', icon: CreditCard },
    { name: 'Transaction History', href: '/transaction-history', icon: History },
    { name: 'Payment Transfer', href: '/payment-transfer', icon: Send },
    { name: 'Connect Bank', href: '/connect-bank', icon: LinkIcon },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname()
    const user = useSelector((state: RootState) => state.user.userData);

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
                            <div className="w-8 h-8  rounded flex items-center justify-center">
                                <Image src="/symbol.png" alt="Next.js Logo" width={26} height={26} />
                            </div>
                            <FlipLink href="/">NextBank</FlipLink>
                        </div>
                        <div className="flex items-center gap-2">
                           {/* <ThemeToggle /> */}
                           <ThemeToggleButton  variant="gif"  url="https://media.giphy.com/media/ArfrRmFCzYXsC6etQX/giphy.gif?cid=ecf05e47kn81xmnuc9vd5g6p5xyjt14zzd3dzwso6iwgpvy3&ep=v1_stickers_search&rid=giphy.gif&ct=s" />
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
                            placeholder="Search"
                            className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
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

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            {/* <AvatarImage src="/placeholder.svg?height=40&width=40" /> */}
                            <AvatarFallback className="bg-blue-600 text-white">{(user as User)?.Name?.split(' ').map((word: string) => word[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{(user as User)?.Name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{(user as User)?.Email}</p>
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
                            <div className="w-6 h-6  rounded flex items-center justify-center">
                                <Image src="/symbol.png" alt="Next.js Logo" width={26} height={26} />
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Next Bank</span>
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
