"use client"

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

// Sample data
const sampleData: SalesData[] = [
  { Column1: "Jan", Code: "A001", Description: "Product A", Quantity: 100, Value: 5000 },
  { Column1: "Feb", Code: "B002", Description: "Product B", Quantity: 150, Value: 7500 },
  { Column1: "Mar", Code: "C003", Description: "Product C", Quantity: 200, Value: 10000 },
]

export default function SpreadsheetPage() {
  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleData.map((item, index) => (
            <TableRow key={index}>
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
  )
}