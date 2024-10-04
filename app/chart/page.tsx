"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styles from './Chart.module.css'

interface SalesData {
  Column1: string
  Value: number
}

// Add a sample data array or fetch data from an API
const data: SalesData[] = [
  { Column1: "Jan", Value: 4000 },
  { Column1: "Feb", Value: 3000 },
  { Column1: "Mar", Value: 2000 },
  { Column1: "Apr", Value: 2780 },
  { Column1: "May", Value: 1890 },
  { Column1: "Jun", Value: 2390 },
]

export default function ChartPage() {
  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Column1" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}