"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Papa from 'papaparse'

interface SalesData {
  month: string
  mobile: number
  desktop: number
}

interface CSVRow {
  Supplier: string
  Code: string
  Description: string
  Quantity: string
  Value: string
}

const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

export default function ChartPage() {
  const [data, setData] = useState<SalesData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      const salesData: SalesData[] = []

      for (const month of allMonths) {
        try {
          const response = await fetch(`/${month.toLowerCase()}.csv`)
          if (!response.ok) {
            if (response.status === 404) {
              console.log(`CSV file for ${month} not found. Skipping.`)
              continue
            }
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const csvText = await response.text()
          
          let mobileTotal = 0
          let desktopTotal = 0
          
          Papa.parse<CSVRow>(csvText, {
            complete: (result) => {
              result.data.forEach((row, index) => {
                const value = parseFloat(row.Value || '0')
                if (!isNaN(value)) {
                  if (index % 2 === 0) {
                    mobileTotal += value
                  } else {
                    desktopTotal += value
                  }
                }
              })
            },
            header: true,
            skipEmptyLines: true
          })

          salesData.push({ month, mobile: mobileTotal, desktop: desktopTotal })
        } catch (error) {
          console.error(`Error fetching data for ${month}:`, error)
          setError(`Error loading data for ${month}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      if (salesData.length > 0) {
        setData(salesData)
      } else {
        setError("No data could be loaded for any month.")
      }
      setIsLoading(false)
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (data.length === 0) {
    return <div>No data available</div>
  }

  return (
    <Card className="w-full h-[calc(100vh-2rem)] bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="text-white">Area Chart - Gradient</CardTitle>
        <CardDescription className="text-gray-400">Showing total visitors for the available months</CardDescription>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[calc(100vh-16rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                }}
                formatter={(value: number, name: string) => [
                  value.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, '.'),
                  name === 'mobile' ? 'Mobile' : 'Desktop'
                ]}
              />
              <Area
                type="monotone"
                dataKey="mobile"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorMobile)"
              />
              <Area
                type="monotone"
                dataKey="desktop"
                stroke="#1d4ed8"
                fillOpacity={1}
                fill="url(#colorDesktop)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}