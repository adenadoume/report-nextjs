"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
]

export function TopMenu() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 flex justify-center overflow-x-auto">
      <div className="flex space-x-1 bg-card p-1 rounded-lg">
        {months.map((month) => (
          <Link
            key={month}
            href={`/${month.toLowerCase()}`}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
              pathname === `/${month.toLowerCase()}` 
                ? "bg-blue-600 text-white dark:bg-blue-700" 
                : "text-muted-foreground hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700"
            }`}
          >
            {month}
          </Link>
        ))}
      </div>
    </nav>
  )
}