"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, Search, X, GripVertical, ChevronRight, Calendar } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { capitalizeFirstLetter, isValidUrl } from "@/lib/utils"
import { useModal } from "@/hooks/use-modal-store"
import Link from "next/link"
import Image from "next/image"
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from "@dnd-kit/core"
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"

export const multiSelectFilter: FilterFn<any> = (row, columnId, filterValue: string[]) => {
  if (!filterValue.length) return true
  const cellValue = row.getValue(columnId)
  return filterValue.includes(String(cellValue))
}

// const DraggableTableHeader = ({ header, table }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
//     id: header.id,
//   })

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   }

//   return (
//     <TableHead
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       className={`
//         cursor-move
//         ${header.column.id === "select" || header.column.id === "skuCode" || header.column.id === "expander" ? "sticky left-0 z-10" : ""}
//         `}
//     >
//       <div className="flex items-center">
//         <GripVertical className="mr-2 h-4 w-4" {...listeners} />
//         {flexRender(header.column.columnDef.header, header.getContext())}
//       </div>
//     </TableHead>
//   )
// }

export default function AdvancedDataTable({ leadProspectCols = [],
  data = [],
  columnNames = [],
  dependentCols = [],
  MoreInfo,
  showTools = true
}: {
  data: string[],
  columnNames: string[],
  dependentCols?: string[],
  leadProspectCols?: any[],
  MoreInfo?: any,
  showTools?: boolean
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedColumn, setSelectedColumn] = React.useState<string | null>(null)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string[]>>({})
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])

  const columns: ColumnDef<any>[] = Boolean(leadProspectCols.length) ? leadProspectCols : generateColumns(columnNames, dependentCols);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    filterFns: {
      multiSelect: multiSelectFilter,
    },
    getRowCanExpand: () => true,
  })

  React.useEffect(() => {
    setColumnOrder(table.getAllLeafColumns().map(d => d.id))
  }, [table])

  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)

  //   const sensors = useSensors(
  //     useSensor(PointerSensor),
  //     useSensor(KeyboardSensor, {
  //       coordinateGetter: sortableKeyboardCoordinates,
  //     })
  //   )

  //   const handleDragEnd = (event: DragEndEvent) => {
  //     const { active, over } = event
  //     if (active.id !== over?.id) {
  //       setColumnOrder((prev) => {
  //         const oldIndex = prev.indexOf(active.id as string)
  //         const newIndex = prev.indexOf(over?.id as string)
  //         return arrayMove(prev, oldIndex, newIndex)
  //       })
  //     }
  //   }

  const getColumnBackground = (columnId: string) => {
    if (columnId === "select" || columnId === "skuCode" || columnId === "expander") {
      return "bg-white"
    }
    const column: any = columns.find((col: any) => col.accessorKey === columnId)
    if (!column?.meta?.group) return ""

    switch (column.meta.group) {
      case "sales":
        return "bg-orange-50"
      case "inventory":
        return "bg-blue-50"
      case "purchase":
        return "bg-green-50"
      case "order":
        return "bg-purple-50"
      default:
        return ""
    }
  }

  // const getHeaderBackground = (columnId: string) => {
  //   if (columnId === "select" || columnId === "skuCode" || columnId === "expander") {
  //     return "bg-gray-100"
  //   }
  //   const column = columns.find(col => col.accessorKey === columnId)
  //   if (!column?.meta?.group) return ""

  //   switch (column.meta.group) {
  //     case "sales":
  //       return "bg-orange-100"
  //     case "inventory":
  //       return "bg-blue-100"
  //     case "purchase":
  //       return "bg-green-100"
  //     case "order":
  //       return "bg-purple-100"
  //     default:
  //       return ""
  //   }
  // }

  const handleFilterChange = (columnId: string, filterValue: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [columnId]: [...(prev[columnId] || []), filterValue],
    }))

    const column = table.getColumn(columnId)
    if (column) {
      const currentFilterValue = column.getFilterValue() as string[]
      column.setFilterValue([...(currentFilterValue || []), filterValue])
    }
  }

  const removeFilter = (columnId: string, filterValue: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((value) => value !== filterValue),
    }))

    const column = table.getColumn(columnId)
    if (column) {
      const currentFilterValue = column.getFilterValue() as string[]
      column.setFilterValue(currentFilterValue.filter((value) => value !== filterValue))
    }
  }

  const ExpandedRowContent = ({ row, dependentCols }: { row: any, dependentCols: string[] }) => {
    let dependentValue = row.original.dependentValue

    return (
      <Card className="w-full max-w-3xl mx-auto my-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {[...dependentCols, 'Created At'].map((col) => (
                  <TableHead key={col} className="text-center">{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {dependentCols.map((col) => (
                  <TableCell key={col} className="text-center">{dependentValue[col]}</TableCell>
                ))}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(dependentValue.createdAt).toLocaleString()}</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {showTools && <div className="flex items-center space-x-2">
          <Input
            placeholder="Filter all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Search className="mr-2 h-4 w-4" />
                Search Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px]">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Search Columns</h4>
                  <p className="text-sm text-muted-foreground">
                    Select columns to filter the table
                  </p>
                </div>
                <ScrollArea className="">
                  <div className="grid gap-2">
                    {table.getAllColumns().filter((column) => column.id === "via" || column.id === 'createdAt' || column.id === "category").map((column) => {
                      return (
                        <Popover key={column.id}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              {column.id}
                              <ChevronDown className="ml-auto h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0" align="start">
                            <div className="p-2">
                              <Input
                                placeholder={`Search ${column.id}...`}
                                value={(column.getFilterValue() as string) ?? ""}
                                onChange={(event) => column.setFilterValue(event.target.value)}
                                className="max-w-sm mb-2"
                              />
                              {Array.from(new Set(data?.map((item) => String(item[column.id as any])))).map((value) => (
                                <div key={value} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={activeFilters[column.id]?.includes(value)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        handleFilterChange(column.id, value)
                                      } else {
                                        removeFilter(column.id, value)
                                      }
                                    }}
                                  />
                                  <label className="text-sm">{value}</label>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
        </div>}
        {leadProspectCols.length !== 0 && <MoreInfo selectedLeads={selectedRows} />}
      </div>
      {Object.entries(activeFilters).map(([columnId, filters]) => (
        filters.map((filter) => (
          <Badge key={`${columnId}-${filter}`} variant="secondary" className="mr-2">
            {columnId}: {filter}
            <Button
              variant="ghost"
              onClick={() => removeFilter(columnId, filter)}
              className="ml-1 h-auto p-0 text-base"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))
      ))}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          {/* <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          > */}
          <Table className="min-w-full">
            {/* <TableHeader>
                <TableRow>
                  <SortableContext
                    items={columnOrder}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getHeaderGroups().map((headerGroup) => (
                      headerGroup.headers.map((header) => (
                        <DraggableTableHeader key={header.id} header={header} table={table} />
                      ))
                    ))}
                  </SortableContext>
                </TableRow>
              </TableHeader> */}
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={`
                          ${rowIndex % 2 === 0 ? "bg-gray-50" : ""}
                          ${row.getIsSelected() ? "bg-blue-100" : ""}
                        `}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={`
                              ${cell.column.id === "select" || cell.column.id === "skuCode" || cell.column.id === "expander" ? "sticky left-0 z-10" : ""}
                              ${getColumnBackground(cell.column.id)}
                              ${selectedColumn === cell.column.id ? "bg-opacity-80 ring-1 ring-inset ring-primary" : ""}
                            `}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <ExpandedRowContent row={row} dependentCols={dependentCols} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* </DndContext> */}
        </div>
      </div>
      {showTools && <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>}
    </div>
  )
}


export const generateColumns = (columnNames: string[], dependentCols: any): ColumnDef<any>[] => {
  const dynamicColumns = columnNames?.map((colName) => ({
    accessorKey: colName,
    header: capitalizeFirstLetter(colName),
    cell: ({ row }: any) => {
      const value = row.getValue(colName)
      return (
        <div className="capitalize">
          {
            isValidUrl(value) ?
              <Link href={value} target="_blank" className="my-1">
                <Image src={value} alt={value} height={250} width={250} className="rounded-sm h-24 w-24 object-cover" />s
              </Link> : <span>{value}</span>
          }
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
    filterFn: multiSelectFilter,
  })) || [];


  const staticColumns = [
    dependentCols.length > 0
      ? {
        id: "expander",
        header: () => null,
        cell: ({ row }: any) => (
          <Button
            variant="ghost"
            onClick={() => row.toggleExpanded()}
            className="p-0 h-auto"
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ),
        enableSorting: false,
        enableHiding: false,
      }
      : undefined, // Return undefined when columnNames is empty
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ].filter(Boolean) as ColumnDef<any>[]; // Filter out undefined entries and assert type

  // Combine static and dynamic columns
  return [...staticColumns, ...dynamicColumns];
};
