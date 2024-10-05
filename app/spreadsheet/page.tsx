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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from 'xlsx'

interface SalesData {
  Supplier: string
  Code: string
  Description: string
  Quantity: number
  Value: number
}

export default function SpreadsheetPage() {
  const [data, setData] = useState<SalesData[]>([])
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const [totals, setTotals] = useState({ Quantity: 0, Value: 0 })
  const [suppliers, setSuppliers] = useState<string[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/september.json')
        const jsonData: SalesData[] = await response.json()
        const sortedData = jsonData.sort((a, b) => a.Supplier.localeCompare(b.Supplier))
        setData(sortedData)
        calculateTotals(sortedData)
        setSuppliers(['All', ...Array.from(new Set(sortedData.map(item => item.Supplier))) as string[]])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
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

  const calculateTotals = (filteredData: SalesData[]) => {
    const totals = filteredData.reduce((acc, item) => {
      acc.Quantity += Math.round(item.Quantity)
      acc.Value += Math.round(item.Value)
      return acc
    }, { Quantity: 0, Value: 0 })
    setTotals(totals)
  }

  const handleSupplierChange = (value: string) => {
    if (value === 'All') {
      setSelectedSupplier(null)
      calculateTotals(data)
    } else {
      setSelectedSupplier(value)
      const filteredData = data.filter(item => item.Supplier === value)
      calculateTotals(filteredData)
    }
  }

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report")

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Supplier
      { wch: 10 }, // Code
      { wch: 40 }, // Description
      { wch: 10 }, // Quantity
      { wch: 10 }, // Value
    ]
    worksheet["!cols"] = columnWidths

    // Add styles
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "3B82F6" } }, // Blue background
    }
    const rowStyle = {
      fill: { fgColor: { rgb: "EFF6FF" } }, // Light blue background
    }

    // Apply styles to header
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] as string)
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C })
      worksheet[address].s = headerStyle
    }

    // Apply alternating row styles
    for (let R = 1; R <= headerRange.e.r; ++R) {
      if (R % 2 === 0) continue // Skip odd rows
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C })
        if (!worksheet[address]) continue
        worksheet[address].s = rowStyle
      }
    }

    XLSX.writeFile(workbook, "sales_report.xlsx")
  }

  const filteredData = selectedSupplier ? data.filter(item => item.Supplier === selectedSupplier) : data

  return (
    <div className="relative flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Sales by Supplier</h1>
      <div className="flex justify-between items-center mb-4">
        <Select onValueChange={handleSupplierChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a supplier" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {suppliers.map((supplier) => (
              <SelectItem key={supplier} value={supplier}>
                {supplier}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={downloadExcel} className="bg-blue-500 hover:bg-blue-600 text-white">
          <Download className="mr-2 h-4 w-4" /> Download Excel
        </Button>
      </div>
      <div 
        className="flex-1 rounded-lg border border-blue-500 overflow-hidden"
        ref={tableRef}
      >
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-20">
              <TableRow>
                <TableHead className="font-bold">Supplier</TableHead>
                <TableHead className="font-bold">Code</TableHead>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="font-bold">Quantity</TableHead>
                <TableHead className="font-bold">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow 
                  key={index}
                  className={`
                    cursor-pointer
                    transition-colors duration-200
                    hover:bg-blue-500 hover:bg-opacity-30
                    ${selectedRow === index ? 'bg-blue-500 bg-opacity-50' : ''}
                  `}
                  onClick={() => handleRowSelection(index)}
                >
                  <TableCell>{item.Supplier}</TableCell>
                  <TableCell>{item.Code}</TableCell>
                  <TableCell>{item.Description}</TableCell>
                  <TableCell>{Math.round(item.Quantity)}</TableCell>
                  <TableCell>{Math.round(item.Value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg flex justify-between">
        <p className="font-bold">Totals{selectedSupplier ? ` for ${selectedSupplier}` : ''}:</p>
        <p>Quantity: {totals.Quantity.toLocaleString()}</p>
        <p>Value: {totals.Value.toLocaleString()}</p>
      </div>
    </div>
  )
}