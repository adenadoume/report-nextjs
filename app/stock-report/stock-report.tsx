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
import { ScrollableSelect } from "@/components/ui/scrollable-select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

interface StockData {
  Supplier: string
  Code: string
  Description: string
  Q: number
  'Cost Price': number
  'Cost * Q': number
  'Sales Price': number
  'Sales Price * Q': number
}

interface CSVRow {
  Supplier: string
  Code: string
  Description: string
  Q: string
  'Cost Price': string
  'Cost * Q': string
  'Sales Price': string
  'Sales Price * Q': string
}

interface StockReportPageProps {
  month: string
}

export default function StockReportPage({ month }: StockReportPageProps) {
  const [data, setData] = useState<StockData[]>([])
  const [totals, setTotals] = useState({ Q: 0, 'Cost * Q': 0, 'Sales Price * Q': 0 })
  const [suppliers, setSuppliers] = useState<string[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/${month}_stock.csv`)
        const blob = await response.blob()
        const reader = new FileReader()
        
        reader.onload = (e) => {
          const csvText = e.target?.result as string
          Papa.parse<CSVRow>(csvText, {
            complete: (result) => {
              const parsedData: StockData[] = result.data
                .map((row) => ({
                  Supplier: row.Supplier || '',
                  Code: row.Code || '',
                  Description: row.Description || '',
                  Q: parseFloat(row.Q || '0'),
                  'Cost Price': parseFloat(row['Cost Price'] || '0'),
                  'Cost * Q': parseFloat(row['Cost * Q'] || '0'),
                  'Sales Price': parseFloat(row['Sales Price'] || '0'),
                  'Sales Price * Q': parseFloat(row['Sales Price * Q'] || '0')
                }))
                .filter((item) => item.Supplier && item.Code)

              const sortedData = parsedData.sort((a, b) => {
                const supplierComparison = a.Supplier.localeCompare(b.Supplier, 'el')
                return supplierComparison !== 0 ? supplierComparison : b['Sales Price * Q'] - a['Sales Price * Q']
              })

              setData(sortedData)
              calculateTotals(sortedData)
              setSuppliers(['All', ...Array.from(new Set(sortedData.map(item => item.Supplier)))])
            },
            header: true,
            skipEmptyLines: true,
            encoding: "ISO-8859-7"
          })
        }

        reader.readAsText(blob, "ISO-8859-7")
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [month])

  const calculateTotals = (filteredData: StockData[]) => {
    const totals = filteredData.reduce((acc, item) => {
      acc.Q += Math.round(item.Q)
      acc['Cost * Q'] += Math.round(item['Cost * Q'])
      acc['Sales Price * Q'] += Math.round(item['Sales Price * Q'])
      return acc
    }, { Q: 0, 'Cost * Q': 0, 'Sales Price * Q': 0 })
    setTotals({
      Q: Math.round(totals.Q),
      'Cost * Q': Math.round(totals['Cost * Q']),
      'Sales Price * Q': Math.round(totals['Sales Price * Q'])
    })
  }

  const handleSupplierChange = (value: string) => {
    const newSelectedSupplier = value === 'All' ? null : value
    setSelectedSupplier(newSelectedSupplier)
    
    const filteredData = newSelectedSupplier
      ? data.filter(item => item.Supplier === newSelectedSupplier)
      : data
    
    calculateTotals(filteredData)
  }

  const filteredData = selectedSupplier
    ? data.filter(item => item.Supplier === selectedSupplier)
    : data

  const handleDownload = () => {
    const workbook = XLSX.utils.book_new()
    const dataWithSums = [
      ...filteredData,
      {
        Supplier: 'Total',
        Code: '',
        Description: '',
        Q: filteredData.reduce((sum, item) => sum + item.Q, 0),
        'Cost Price': '',
        'Cost * Q': filteredData.reduce((sum, item) => sum + item['Cost * Q'], 0),
        'Sales Price': '',
        'Sales Price * Q': filteredData.reduce((sum, item) => sum + item['Sales Price * Q'], 0)
      }
    ]
    const worksheet = XLSX.utils.json_to_sheet(dataWithSums)
    const columnWidths = [
      { wch: 15 }, // Supplier
      { wch: 10 }, // Code
      { wch: 40 }, // Description
      { wch: 10 }, // Q
      { wch: 10 }, // Cost Price
      { wch: 10 }, // Cost * Q
      { wch: 10 }, // Sales Price
      { wch: 10 }, // Sales Price * Q
    ]
    worksheet["!cols"] = columnWidths
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Report")
    const monthName = month.charAt(0).toUpperCase() + month.slice(1)
    XLSX.writeFile(workbook, `Stock Report - ${monthName} 24.xlsx`)
  }

  return (
    <div className="relative flex flex-col h-full bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">{`Stock Report - ${month.charAt(0).toUpperCase() + month.slice(1)}`}</h1>
      <div className="flex justify-between items-center mb-4">
        <ScrollableSelect
          options={suppliers}
          placeholder="Select a supplier"
          onValueChange={handleSupplierChange}
        />
        <Button 
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          <Download className="mr-2 h-4 w-4" /> Download Excel
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="text-muted-foreground">Supplier</TableHead>
              <TableHead className="text-muted-foreground">Code</TableHead>
              <TableHead className="text-muted-foreground">Description</TableHead>
              <TableHead className="text-muted-foreground">Q</TableHead>
              <TableHead className="text-muted-foreground">Cost Price</TableHead>
              <TableHead className="text-muted-foreground">Cost * Q</TableHead>
              <TableHead className="text-muted-foreground">Sales Price</TableHead>
              <TableHead className="text-muted-foreground">Sales Price * Q</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index} className="border-b border-muted">
                <TableCell>{item.Supplier}</TableCell>
                <TableCell>{item.Code}</TableCell>
                <TableCell>{item.Description}</TableCell>
                <TableCell>{Math.round(item.Q).toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</TableCell>
                <TableCell>{Math.round(item['Cost Price']).toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</TableCell>
                <TableCell>{Math.round(item['Cost * Q']).toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</TableCell>
                <TableCell>{Math.round(item['Sales Price']).toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</TableCell>
                <TableCell>{Math.round(item['Sales Price * Q']).toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 bg-blue-600 dark:bg-blue-700 text-white p-4 rounded-lg shadow-lg flex justify-between">
        <p className="font-bold">Totals{selectedSupplier ? ` for ${selectedSupplier}` : ''}:</p>
        <p>Q: {totals.Q.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</p>
        <p>Cost * Q: {totals['Cost * Q'].toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</p>
        <p>Sales Price * Q: {totals['Sales Price * Q'].toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</p>
      </div>
    </div>
  )
}