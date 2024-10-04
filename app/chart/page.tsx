"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styles from './Chart.module.css'

interface SalesData {
  Column1: string
  Value: number
}

export default function ChartPage() {
  const [data, setData] = useState<SalesData[]>([])

  useEffect(() => {
    fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SalesReportDashboard-831s3k8ap4NTDf06p4mEBbj8wFiqkp.json')
      .then(response => response.json())
      .then(jsonData => {
        const groupedData = jsonData.reduce((acc: { [key: string]: number }, item: SalesData) => {
          if (item.Column1 && item.Value) {
            acc[item.Column1] = (acc[item.Column1] || 0) + Math.round(Number(item.Value))
          }
          return acc
        }, {})

        const sortedData = Object.entries(groupedData)
          .map(([Column1, Value]) => ({ Column1, Value }))
          .sort((a, b) => b.Value - a.Value)

        setData(sortedData)
      })
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-blue-500 rounded">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 h-full">
      <h1 className="text-2xl font-bold mb-4">Chart September</h1>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={data.length * 50}>
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => Math.round(value).toString()} />
            <YAxis dataKey="Column1" type="category" width={150} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Value" fill="#3b82f6" barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}