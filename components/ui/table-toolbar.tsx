"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "../DatePickerWithRange"
import { DateRange } from "react-day-picker"
import { Dispatch, SetStateAction } from "react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filter: string
  setFilter: Dispatch<SetStateAction<string>>
  date: DateRange | undefined
  setDate: Dispatch<SetStateAction<DateRange | undefined>>
}

export function DataTableToolbar<TData>({
  table,
  filter,
  setFilter,
  date,
  setDate,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter records..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <DatePickerWithRange date={date} setDate={setDate} />
    </div>
  )
}
