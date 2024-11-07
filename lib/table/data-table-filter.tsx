'use client'

import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, PlusCircleIcon } from "lucide-react"
import { Column, Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface DataTableFacetedFilterProps<TData, TValue> {
  table: Table<TData>
  data: Record<string, any>[]
  title?: string
}

export function DataTableFacetedFilter<TData, TValue>({
  table,
  data,
  title,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [openPopover, setOpenPopover] = React.useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, Set<string>>>({})

  const columns = table.getAllColumns() || []

// Updates filter state and applies filter immediately
const handleFilterChange = (columnId: string, value: string) => {
  setSelectedFilters((prev) => {
    const updatedFilters = { ...prev }
    
    if (!updatedFilters[columnId]) {
      updatedFilters[columnId] = new Set()
    }
    
    // Toggle selection in the filter set
    if (updatedFilters[columnId].has(value)) {
      updatedFilters[columnId].delete(value)
    } else {
      updatedFilters[columnId].add(value)
    }
    
    if (updatedFilters[columnId].size === 0) {
      delete updatedFilters[columnId]
    }
    
    // Apply filter to the column immediately after updating filter state
    const column = table.getColumn(columnId)
    if (column) {
      const filterValues = updatedFilters[columnId] 
        ? Array.from(updatedFilters[columnId]) 
        : undefined
      column.setFilterValue(filterValues)
    }

    return updatedFilters
  })
}


  // Counts selected filters across all columns
  const totalSelectedFilters = Object.values(selectedFilters).reduce((acc, set) => acc + set.size, 0)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}
          {totalSelectedFilters > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {totalSelectedFilters}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {totalSelectedFilters > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {totalSelectedFilters} selected
                  </Badge>
                ) : (
                  Object.entries(selectedFilters).map(([columnId, values]) =>
                    values.size > 0 && (
                      <Badge variant="secondary" key={columnId} className="rounded-sm px-1 font-normal">
                        {columnId}: {values.size}
                      </Badge>
                    )
                  )
                )}
              </div>
            </>
          )}
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {columns.map((column) => (
          <Popover
            key={column.id}
            open={openPopover === column.id}
            onOpenChange={(open) => setOpenPopover(open ? column.id : null)}
          >
            <PopoverTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="w-full cursor-default justify-between"
              >
                {column.id}
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </DropdownMenuItem>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start" side="right" sideOffset={5}>
              <Command>
                <CommandInput placeholder={`Filter ${column.id}...`} />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {Array.from(
                      new Set(
                        data
                          .map(item => {
                            const value = item[column.id]
                            return typeof value === "object" ? undefined : value
                          })
                          .filter(value => value !== undefined) // Filter out any undefined values
                      )
                    ).map((value) => {
                      const isSelected = selectedFilters[column.id]?.has(value?.toString() ?? '')
                      return (
                        <CommandItem
                          key={value}
                          onSelect={() => handleFilterChange(column.id, value?.toString() ?? '')}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </div>
                          <span>{value}</span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ))}
        {totalSelectedFilters > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setSelectedFilters({})
                columns.forEach(column => column.setFilterValue(undefined))
              }}
              className="justify-center text-center"
            >
              Clear all filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
