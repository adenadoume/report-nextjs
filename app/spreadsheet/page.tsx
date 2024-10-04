"use client"

import { useEffect, useState, useRef } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface SalesData {
  Column1: string
  Code: string
  Description: string
  Quantity: number
  Value: number
}

export default function SpreadsheetPage() {
  const [data, setData] = useState<SalesData[]>([])
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SalesReportDashboard-831s3k8ap4NTDf06p4mEBbj8wFiqkp.json')
      .then(response => response.json())
      .then(jsonData => {
        const roundedData = jsonData.map((item: SalesData) => ({
          ...item,
          Quantity: Math.round(item.Quantity),
          Value: Math.round(item.Value)
        }))
        setData(roundedData)
      })
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setSelectedRow(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleRowSelection = (index: number) => {
    setSelectedRow(prevSelected => prevSelected === index ? null : index)
  }

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">Sales Report for September</h1>
      <div 
        className="rounded-lg border border-blue-500 overflow-hidden"
        ref={tableRef}
      >
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold sticky top-0 bg-background z-10">Column1</TableHead>
                <TableHead className="font-bold sticky top-0 bg-background z-10">Code</TableHead>
                <TableHead className="font-bold sticky top-0 bg-background z-10">Description</TableHead>
                <TableHead className="font-bold sticky top-0 bg-background z-10">Quantity</TableHead>
                <TableHead className="font-bold sticky top-0 bg-background z-10">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow 
                  key={index}
                  className={`
                    cursor-pointer
                    transition-colors duration-200
                    hover:bg-blue-500 hover:bg-opacity-20
                    ${selectedRow === index ? 'bg-blue-500 bg-opacity-40' : ''}
                  `}
                  onClick={() => handleRowSelection(index)}
                >
                  <TableCell>{item.Column1}</TableCell>
                  <TableCell>{item.Code}</TableCell>
                  <TableCell>{item.Description}</TableCell>
                  <TableCell>{item.Quantity}</TableCell>
                  <TableCell>{item.Value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}