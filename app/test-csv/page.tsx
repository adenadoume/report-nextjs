'use client'

import { useEffect, useState } from 'react'

export default function TestCSV() {
  const [csvContent, setCsvContent] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/august_customer.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        console.log('CSV content:', text.slice(0, 200)); // Log the first 200 characters
        setCsvContent(text);
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
        setError(error.message);
      });
  }, [])

  return (
    <div>
      <h1>August Customer CSV Content Test</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : csvContent ? (
        <pre>{csvContent}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}