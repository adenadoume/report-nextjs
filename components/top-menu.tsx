"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart } from "lucide-react"

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
]

export function TopMenu() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 flex justify-center">
      <div className="flex space-x-1 bg-card p-1 rounded-lg overflow-x-auto">
        {months.map((month) => (
          <Link
            key={month}
            href={`/${month.toLowerCase()}`}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              pathname === `/${month.toLowerCase()}` 
                ? "bg-blue-500 text-white" 
                : "text-muted-foreground hover:bg-blue-500 hover:bg-opacity-20 hover:text-blue-500"
            }`}
          >
            {month}
          </Link>
        ))}
        <Link
          href="/chart"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
            pathname === "/chart" 
              ? "bg-blue-500 text-white" 
              : "text-muted-foreground hover:bg-blue-500 hover:bg-opacity-20 hover:text-blue-500"
          }`}
        >
          <BarChart className="mr-2 h-4 w-4" />
          Charts
        </Link>
      </div>
    </nav>
  )
}