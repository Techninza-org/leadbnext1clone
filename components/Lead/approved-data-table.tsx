"use client"

import * as React from "react"
import XLSX from "xlsx"
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

import { PlusCircle, UploadIcon } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"
import { useAtom, useAtomValue } from "jotai"
import { userAtom } from "@/lib/atom/userAtom"
import csvtojson from 'csvtojson';
import { useLead } from "../providers/LeadProvider"
import { useMutation } from "graphql-hooks"
import { leadMutation } from "@/lib/graphql/lead/mutation"
import { format, parse } from "date-fns"
import { DataTableToolbar } from "../ui/table-toolbar"
import { DataTablePagination } from "../ui/table-pagination"
import { Button } from "../ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}


export function ApprovedDataTable<TData, TValue>({
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
        const fileContent = await file.text();
            const jsonData = await csvtojson().fromString(fileContent);
            const results = await Promise.all(jsonData.map(async (lead) => {
              const vehicleDate = parse(lead.vehicleDate, 'dd-MM-yyyy', new Date());
              const formattedVehicleDate = format(vehicleDate, 'dd-MM-yyyy');
              const { data, error } = await createLead({
                variables: {
                    companyId: userInfo?.companyId || "",
                    name: lead.name,
                    email: lead.email,
                    phone: lead.phone,
                    // alternatePhone: lead.alternatePhone,
                    address: lead.address,
                    city: lead.city,
                    state: lead.state,
                    zip: lead.zip,
                    vehicleDate: formattedVehicleDate,
                    vehicleName: lead.vehicleName,
                    vehicleModel: lead.vehicleModel,
                }
            });
            
            handleCreateBulkLead({ lead: data?.createLead, error });

            }));

      } catch (error) {
        console.error('Error parsing CSV:', error);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {
            userRole === "manager" && (
              <Button
                onClick={() => onOpen("assignLead", { leads: selectedRows })}
                variant={'default'}
                size={"sm"}
                className="items-center gap-1"
                disabled={!selectedRows.length}
              >
                Assign Lead
              </Button>
            )
          }
      {/* <div className="flex justify-between">
        <DataTableToolbar table={table} setFilter={setFilter} />
        <div className="flex gap-2 items-center">
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
                onClick={handleButtonClick}
              >
                <UploadIcon size={15} /> <span>Upload Leads</span>
              </Button>
            </label>

          </div>
          <Button
            onClick={() => onOpen("addLead")}
            variant={'default'}
            size={"sm"}
            className="items-center gap-1">
            <PlusCircle size={15} /> <span>Add New Lead</span>
          </Button>
        </div>
      </div> */}
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
