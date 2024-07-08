"use client"

import { CrossIcon } from "lucide-react"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { statuses } from "@/lib/table/table-utils"
import { DataTableFacetedFilter } from "@/lib/table/data-table-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  setFilter: (value: string) => void
}

export function DataTableToolbar<TData>({
  table,
  setFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          // value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}   // not required as using global filter
          onChange={(event) =>
            setFilter(event.target.value)
            // table.getColumn("title")?.setFilterValue(event.target.value)   // not required as using global filter
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* {table.getColumn("callStatus") && (
          <DataTableFacetedFilter
            table={table}
            column={table.getColumn("callStatus")}
            rows={table.getRowModel().rows}
            title="Status"
            options={statuses}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <CrossIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  )
}
