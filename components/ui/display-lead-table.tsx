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
import { useAtom, useAtomValue } from "jotai"
import { userAtom } from "@/lib/atom/userAtom"
import { useMutation } from "graphql-hooks"
import { leadMutation } from "@/lib/graphql/lead/mutation"
import { useLead } from "../providers/LeadProvider"
import { useModal } from "@/hooks/use-modal-store"
import { Button } from "./button"
import { DownloadIcon, PlusCircle, UploadIcon } from "lucide-react"
import { handleFileDownload } from "@/lib/utils"
import { useCompany } from "../providers/CompanyProvider"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}


export function DataTableLead<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [filteredData, setFilteredData] = React.useState<any[]>(data)
  const { optForms } = useCompany()
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

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { handleCreateLead, handleCreateBulkLead } = useLead()
  const [createLead, { loading }] = useMutation(leadMutation.CREATE_LEAD);
  const [userInfo] = useAtom(userAtom)

  const table = useReactTable({
    data,
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


  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row: any) => row.original)

  const { onOpen } = useModal()

  const userRole = useAtomValue(userAtom)?.role?.name?.toLowerCase()

  const handleFileChange = async (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('leads', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_API || 'http://localhost:8080'}/graphql/bulk-upload-lead`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `x-lead-token ${userInfo?.token || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error uploading CSV file');
        }
        const contentType = response.headers.get('Content-Type');

        if (contentType && contentType.includes('text/csv')) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'error_report.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          const result = await response.json();
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const addProspectForm = optForms.find((x: any) => x.name === "Prospect")

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <DataTableToolbar table={table} data={data} setFilter={setFilter} />
          {/* <DatePickerWithRange date={date} setDate={setDate} disabledDates={{ after: new Date() }} /> */}
        </div>

        <div className="flex gap-2 items-center">
          <Button
            onClick={() => onOpen("assignLead", { leads: selectedRows })}
            variant={'default'}
            size={"sm"}
            className="items-center gap-1"
            disabled={!selectedRows.length}
          >
            Assign Lead
          </Button>
          <div>
            <Button
              variant="default"
              color="primary"
              size={"sm"}
              className="items-center gap-1"
              onClick={() => handleFileDownload("lead.csv")}
            >
              <DownloadIcon size={15} /> <p>Download Sample</p>
            </Button>
          </div>
          <div>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              id="csv-upload"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileChange({ target: { files: Array.from(event.target.files || []) } })}
            />
            <label htmlFor="csv-upload">
              <Button
                variant="default"
                color="primary"
                size={"sm"}
                className="items-center gap-1"
                onClick={() => onOpen("uploadPrspectModal", { fields: addProspectForm })}
              >
                <UploadIcon size={15} /> <span>Upload Prospects</span>
              </Button>
            </label>

          </div>
          <Button
            onClick={() => onOpen("addLead", { fields: addProspectForm })}
            variant={'default'}
            size={"sm"}
            className="items-center gap-1">
            <PlusCircle size={15} /> <span>Add New Prospect</span>
          </Button>
        </div>

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
