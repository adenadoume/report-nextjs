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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface SalesData {
  Supplier: string
  Code: string
  Description: string
  Quantity: number
  Value: number
}

interface SpreadsheetPageProps {
  month: string
}

export default function SpreadsheetPage({ month }: SpreadsheetPageProps) {
  const [data, setData] = useState<SalesData[]>([])
  const [totals, setTotals] = useState({ Quantity: 0, Value: 0 })
  const [suppliers, setSuppliers] = useState<string[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/${month}.json`)
        const jsonData: SalesData[] = await response.json()
        const sortedData = jsonData.sort((a, b) => a.Supplier.localeCompare(b.Supplier))
        setData(sortedData)
        calculateTotals(sortedData)
        setSuppliers(['All', ...Array.from(new Set(sortedData.map(item => item.Supplier)))])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [month])

  const calculateTotals = (filteredData: SalesData[]) => {
    const totals = filteredData.reduce((acc, item) => {
      acc.Quantity += item.Quantity
      acc.Value += item.Value
      return acc
    }, { Quantity: 0, Value: 0 })
    setTotals(totals)
  }

  const handleSupplierChange = (value: string) => {
    setSelectedSupplier(value === 'All' ? null : value)
  }

  const filteredData = selectedSupplier
    ? data.filter(item => item.Supplier === selectedSupplier)
    : data

  const handleDownload = () => {
    // TODO: Implement Excel download functionality
    console.log('Download functionality not implemented yet')
  }

  return (
    <div className="relative flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Sales by Supplier - {month.charAt(0).toUpperCase() + month.slice(1)}</h1>
      <div className="flex justify-between items-center mb-4">
        <Select onValueChange={handleSupplierChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier} value={supplier}>
                {supplier}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" /> Download Excel
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.Supplier}</TableCell>
                <TableCell>{item.Code}</TableCell>
                <TableCell>{item.Description}</TableCell>
                <TableCell>{item.Quantity}</TableCell>
                <TableCell>{item.Value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg flex justify-between">
        <p className="font-bold">Totals{selectedSupplier ? ` for ${selectedSupplier}` : ''}:</p>
        <p>Quantity: {totals.Quantity}</p>
        <p>Value: {totals.Value}</p>
      </div>
    </div>
  )
}