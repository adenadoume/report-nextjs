"use client"

import { useEffect, useState } from "react"
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
  const [selectedRows, setSelectedRows] = useState<number[]>([])

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

  const toggleRowSelection = (index: number) => {
    setSelectedRows(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Report for September</h1>
      <div className="rounded-lg border border-blue-500 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Column1</TableHead>
              <TableHead className="font-bold">Code</TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold">Quantity</TableHead>
              <TableHead className="font-bold">Value</TableHead>
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
                  ${selectedRows.includes(index) ? 'bg-blue-500 bg-opacity-40' : ''}
                `}
                onClick={() => toggleRowSelection(index)}
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
  )
}