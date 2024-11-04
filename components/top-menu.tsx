"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
]

export function TopMenu() {
  const pathname = usePathname()
  const pathParts = pathname.split('/')
  const currentMonth = pathParts[1] || 'october'
  const reportType = pathParts[2] || ''

  return (
    <nav className="flex-1 flex justify-between items-center w-full">
      <Image 
        src="/WS-logo.jpg" 
        alt="WS Logo" 
        width={60} 
        height={60} 
        className="mr-2"
      />
      <div className="flex items-center space-x-1 bg-card p-1 rounded-lg">
        {months.map((month) => (
          <Link
            key={month}
            href={`/${month.toLowerCase()}${reportType ? `/${reportType}` : ''}`}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
              currentMonth === month.toLowerCase()
                ? "bg-blue-600 text-white dark:bg-blue-700" 
                : "text-black dark:text-muted-foreground hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700"
            }`}
          >
            {month}
          </Link>
        ))}
      </div>
      <div className="flex items-center">
        <ModeToggle />
        <div className="w-5" /> {/* This creates a 20px gap */}
        <Image 
          src="/agop.pro-logo.png" 
          alt="Agop.pro Logo" 
          width={80} 
          height={80}
        />
      </div>
    </nav>
  )
}