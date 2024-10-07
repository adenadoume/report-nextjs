"use client"

import { PersonIcon, GlobeIcon, ArchiveIcon } from "@radix-ui/react-icons"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState('september')
  const [isExpanded, setIsExpanded] = useState(false)
  // Remove the following line
  // const [selectedItem, setSelectedItem] = useState('')

  useEffect(() => {
    const pathParts = pathname.split('/')
    const month = pathParts[1] || 'september'
    setCurrentMonth(month)
  }, [pathname])

  const menuItems = [
    { icon: PersonIcon, title: "Sales Report by Customer", href: `/${currentMonth}/customer` },
    { icon: GlobeIcon, title: "Sales Report by Supplier", href: `/${currentMonth}` },
    { icon: ArchiveIcon, title: "Stock Report", href: `/${currentMonth}/stock` },
  ]

  const handleItemClick = (href: string) => {
    router.push(href)
  }

  const isSelected = (href: string) => {
    if (href === `/${currentMonth}`) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div 
      className={`flex flex-col py-4 overflow-hidden bg-card text-card-foreground border-r border-blue-500 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {menuItems.map((item, index) => (
        <button 
          key={index}
          onClick={() => handleItemClick(item.href)}
          className={`flex items-center px-4 py-3 mt-2 rounded-lg transition-colors duration-200 ${
            isSelected(item.href)
              ? "bg-blue-600 text-white dark:bg-blue-700"
              : "hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700"
          }`}
        >
          <item.icon className="w-6 h-6 flex-shrink-0" />
          <span className={`ml-4 whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            {item.title}
          </span>
        </button>
      ))}
    </div>
  )
}