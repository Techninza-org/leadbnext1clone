"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./table-pagination"
import { DataTableToolbar } from "./table-toolbar"
import { DatePickerWithRange } from "../DatePickerWithRange"
import { DateRange } from "react-day-picker"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}


export function FollowUpBidDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [filteredData, setFilteredData] = React.useState<any[]>(data)
  const defaultToDate = new Date();
  const defaultFromDate = new Date();
  defaultFromDate.setDate(defaultToDate.getDate() - 10);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: defaultFromDate,
    to: defaultToDate,
  })

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [filter, setFilter] = React.useState<string>("")


  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })
  
  React.useEffect(() => {
    if (!date?.from || !date?.to || date.from.getTime() === date.to.getTime()) return;
    const fromTimestamp = date.from.setHours(0, 0, 0, 0);
    const toTimestamp = date.to.setHours(23, 59, 59, 999);

    const filteredByDate = data.filter((row: any) => {
      const createdAtTimestamp = new Date(parseInt(row.createdAt)).getTime();
      console.log(createdAtTimestamp , fromTimestamp , createdAtTimestamp , toTimestamp)
      return createdAtTimestamp >= fromTimestamp && createdAtTimestamp <= toTimestamp;
    });
    setFilteredData(filteredByDate);
  }, [data, date]);

  
  

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <DataTableToolbar table={table} data={data} setFilter={setFilter} />
        <DatePickerWithRange date={date} setDate={setDate} disabledDates={{ after: new Date() }} />
      </div>
      <div className="rounded-md border">
        <Table>
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
