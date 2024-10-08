import React from 'react'

interface SalesReportPageProps {
  month: string
  view: string
}

const SalesReportPage: React.FC<SalesReportPageProps> = ({ month, view }) => {
  return (
    <div>
      <h1>Sales Report</h1>
      <p>Month: {month}</p>
      <p>View: {view}</p>
      {/* Add more components and logic here as needed */}
    </div>
  )
}

export default SalesReportPage