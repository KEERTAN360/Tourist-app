"use client"

import { Home, MapPin, CreditCard, FileText, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"

export default function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: MapPin, label: "Tourist Spots", href: "/tourist-spots" },
    { icon: CreditCard, label: "Pay", href: "/pay" },
    { icon: FileText, label: "Documents", href: "/documents" },
    { icon: AlertTriangle, label: "SOS", href: "/sos" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center gap-1 p-2 h-auto transition-all duration-300 rounded-xl ${
                isActive
                  ? "text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className={`text-xs font-medium ${isActive ? "text-white" : "text-gray-600"}`}>{item.label}</span>
            </Button>
          )
        })}
      </div>

      <div className="text-center mt-2 pb-2">
        <p className="text-xs text-gray-400">Made in Bangalore, India</p>
      </div>
    </div>
  )
}
