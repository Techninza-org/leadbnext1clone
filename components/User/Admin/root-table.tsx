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

import { DataTablePagination } from "@/components/ui/table-pagination"
import { DataTableToolbar } from "@/components/ui/table-toolbar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarDaysIcon } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function RootTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])

    // Custom global filter
    const [filter, setFilter] = React.useState<string>("")

    const [monthData, setMonthData] = React.useState<any[]>([]);

    const [selectedMonth, setSelectedMonth] = React.useState<Date | undefined>(undefined);

    const handleDayClick = (date: Date) => {
        setSelectedMonth(date);
        const monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
        const monthEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime();
        const filteredData = data.filter((lead: any) => {
            return lead.createdAt >= monthStartDate && lead.createdAt <= monthEndDate;
        })        
        setMonthData(filteredData);
    };

    const table = useReactTable({
        data: selectedMonth ? monthData : data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter: filter,  // Custom global filter
        },
        onGlobalFilterChange: setFilter,  // Custom global filter
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

    const handleSort = (value: string) => {
        if (value === 'Contacted') {
            const currentSorting = table.getState().sorting;
            const contactedSort = currentSorting.find(sort => sort.id === 'callStatus');

            const newSorting: SortingState = contactedSort
                ? [{ id: 'callStatus', desc: !contactedSort.desc }]
                : [{ id: 'callStatus', desc: false }];
            setSorting(newSorting);
        } else if (value === 'Follow Up Date') {
            const currentSorting = table.getState().sorting;
            const followUpDateSort = currentSorting.find(sort => sort.id === 'nextFollowUpDate');

            const newSorting: SortingState = followUpDateSort
                ? [{ id: 'nextFollowUpDate', desc: !followUpDateSort.desc }]
                : [{ id: 'nextFollowUpDate', desc: false }];
            setSorting(newSorting);
        } else {
            setSorting([]);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div className="grid gap-4">
                {/* <Popover>
                    <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !selectedMonth && "text-muted-foreground",
                                )}
                            >
                                {selectedMonth ? (
                                    format(selectedMonth, "MMM yyyy") 
                                ) : (
                                    <span>Pick a month</span>
                                )}
                                <CalendarDaysIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedMonth}
                            onDayClick={handleDayClick}
                            disabled={(date) =>
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover> */}
                <DataTableToolbar table={table} setFilter={setFilter} />
                </div>
                {/*
                <Select onValueChange={(value) => handleSort(value || 'Reset')}>
                    <SelectTrigger className="w-64">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Company Name">Company Name</SelectItem>
                            <SelectItem value="Plan">Plan</SelectItem>
                            <SelectItem value="None">None</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select> */}
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
