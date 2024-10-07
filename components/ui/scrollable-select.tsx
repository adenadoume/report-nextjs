import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ScrollableSelectProps {
  options: string[]
  placeholder: string
  onValueChange: (value: string) => void
}

export function ScrollableSelect({ options, placeholder, onValueChange }: ScrollableSelectProps) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] text-black dark:text-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[400px] overflow-y-auto">
        {options.map((option) => (
          <SelectItem key={option} value={option} className="text-black dark:text-white">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}