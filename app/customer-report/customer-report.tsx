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
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { ScrollableSelect } from "@/components/ui/scrollable-select"

interface SalesData {
  Code: string
  Customer: string
  Quantity: number
  Value: number
}

interface CSVRow {
  Code: string
  Customer: string
  Quantity: string
  Value: string
}

interface CustomerReportPageProps {
  month: string
}

export default function CustomerReportPage({ month }: CustomerReportPageProps) {
  const [data, setData] = useState<SalesData[]>([])
  const [totals, setTotals] = useState({ Quantity: 0, Value: 0 })
  const [customers, setCustomers] = useState<string[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching data for ${month}...`);
        const response = await fetch(`/${month}_customer.csv`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        console.log(`CSV content for ${month} (first 200 chars):`, csvText.slice(0, 200));

        Papa.parse<CSVRow>(csvText, {
          complete: (result) => {
            console.log(`Parsed data for ${month} (first 5 rows):`, result.data.slice(0, 5));
            if (result.errors.length > 0) {
              console.error(`Parsing errors for ${month}:`, result.errors);
            }
            const parsedData: SalesData[] = result.data
              .map((row) => ({
                Code: row.Code || '',
                Customer: row.Customer || '',
                Quantity: parseFloat(row.Quantity || '0'),
                Value: parseFloat(row.Value || '0')
              }))
              .filter((item) => item.Code && item.Customer);

            console.log(`Filtered data for ${month} (first 5 rows):`, parsedData.slice(0, 5));
            const sortedData = parsedData.sort((a, b) => b.Value - a.Value);
            setData(sortedData);
            calculateTotals(sortedData);
            setCustomers(['All', ...Array.from(new Set(sortedData.map(item => item.Customer)))]);
          },
          header: true,
          skipEmptyLines: true
        });
      } catch (error) {
        console.error(`Error fetching data for ${month}:`, error);
      }
    };

    fetchData();
  }, [month]);

  const calculateTotals = (filteredData: SalesData[]) => {
    const totals = filteredData.reduce((acc, item) => {
      acc.Quantity += Math.round(item.Quantity)
      acc.Value += Math.round(item.Value)
      return acc
    }, { Quantity: 0, Value: 0 })
    setTotals({
      Quantity: Math.round(totals.Quantity),
      Value: Math.round(totals.Value)
    })
  }

  const handleCustomerChange = (value: string) => {
    const newSelectedCustomer = value === 'All' ? null : value
    setSelectedCustomer(newSelectedCustomer)
    
    const filteredData = newSelectedCustomer
      ? data.filter(item => item.Customer === newSelectedCustomer)
      : data
    
    calculateTotals(filteredData)
  }

  const filteredData = selectedCustomer
    ? data.filter(item => item.Customer === selectedCustomer)
    : data

  const handleDownload = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Add sum row to the filtered data
    const dataWithSums = [
      ...filteredData,
      {
        Code: 'Total',
        Customer: '',
        Quantity: filteredData.reduce((sum, item) => sum + item.Quantity, 0),
        Value: filteredData.reduce((sum, item) => sum + item.Value, 0)
      }
    ]

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataWithSums)

    // Set column widths
    const columnWidths = [
      { wch: 10 }, // Code
      { wch: 40 }, // Customer
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
    const sumRowStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "BBDEFB" } }, // Light blue background for sum row
    }

    // Apply styles to header
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] as string)
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C })
      worksheet[address].s = headerStyle
    }

    // Apply alternating row styles and sum row style
    for (let R = 1; R <= headerRange.e.r; ++R) {
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C })
        if (!worksheet[address]) continue
        if (R === headerRange.e.r) {
          worksheet[address].s = sumRowStyle
        } else if (R % 2 === 0) {
          worksheet[address].s = rowStyle
        }
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report")

    // Generate the Excel file with the new naming convention including the year
    const monthName = month.charAt(0).toUpperCase() + month.slice(1)
    XLSX.writeFile(workbook, `Sales by Customer - ${monthName} 24.xlsx`)
  }

  return (
    <div className="relative flex flex-col h-full bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">{`Sales Report by Customer - ${month.charAt(0).toUpperCase() + month.slice(1)}`}</h1>
      <div className="flex justify-between items-center mb-4">
        <ScrollableSelect
          options={customers}
          placeholder="Select a customer"
          onValueChange={handleCustomerChange}
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
              <TableHead className="text-muted-foreground">Code</TableHead>
              <TableHead className="text-muted-foreground">Customer</TableHead>
              <TableHead className="text-muted-foreground">Quantity</TableHead>
              <TableHead className="text-muted-foreground">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index} className="border-b border-muted">
                <TableCell>{item.Code}</TableCell>
                <TableCell>{item.Customer}</TableCell>
                <TableCell>{Math.round(item.Quantity).toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</TableCell>
                <TableCell>{Math.round(item.Value).toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 bg-blue-600 dark:bg-blue-700 text-white p-4 rounded-lg shadow-lg flex justify-between">
        <p className="font-bold">Totals{selectedCustomer ? ` for ${selectedCustomer}` : ''}:</p>
        <p>Quantity: {totals.Quantity.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</p>
        <p>Value: {totals.Value.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }).replace(/,/g, '.')}</p>
      </div>
    </div>
  )
}