import Link from "next/link"
import { BarChart, FileSpreadsheet } from "lucide-react"

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-card text-card-foreground border-r border-blue-500">
      <div className="flex items-center justify-center h-16 border-b border-blue-500">
        <span className="text-2xl font-semibold">Sales Dashboard</span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/chart" className="flex items-center p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200">
              <BarChart className="mr-2" />
              Chart September
            </Link>
          </li>
          <li>
            <Link href="/spreadsheet" className="flex items-center p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200">
              <FileSpreadsheet className="mr-2" />
              Sales Report September
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}