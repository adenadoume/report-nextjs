"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts'
import styles from './Chart.module.css'

interface SalesData {
  Supplier: string
  Value: number
}

type CustomTooltipProps = TooltipProps<number, string> & {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
};

export default function ChartPage() {
  const [data, setData] = useState<SalesData[]>([])

  useEffect(() => {
    fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SalesReportDashboard-831s3k8ap4NTDf06p4mEBbj8wFiqkp.json')
      .then(response => response.json())
      .then(jsonData => {
        const groupedData = jsonData.reduce((acc: { [key: string]: number }, item: SalesData) => {
          if (item.Supplier && item.Value) {
            acc[item.Supplier] = (acc[item.Supplier] || 0) + Math.round(Number(item.Value))
          }
          return acc
        }, {})

        const sortedData = Object.entries(groupedData)
          .map(([Supplier, Value]) => ({ Supplier, Value: Value as number }))
          .sort((a, b) => b.Value - a.Value)
          .slice(0, 10)

        setData(sortedData)
      })
  }, [])

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
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
    <div className={styles.chartContainer}>
      <h1 className="text-2xl font-bold mb-4">Sales Chart</h1>
      <div className="h-[calc(100vh-150px)] border border-blue-500 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => Math.round(value).toString()} />
            <YAxis dataKey="Supplier" type="category" width={150} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Value" fill="#3b82f6" barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}