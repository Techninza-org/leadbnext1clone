"use client"

import { MoreHorizontal } from "lucide-react"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModal } from "@/hooks/use-modal-store"
import { leadSchema } from "@/types/lead"
import { z } from "zod"
import { userAtom } from "@/lib/atom/userAtom"
import { useAtomValue } from "jotai"
import { updateDependentFields } from "@/lib/utils"
import { useCompany } from "@/components/providers/CompanyProvider"


interface DataTableRowActionsProps<TData> {
  lead: z.infer<typeof leadSchema>
}

export function AssignedLeadTableRowActions<TData>({
  lead,
}: DataTableRowActionsProps<TData>) {
  const { onOpen } = useModal()
  const user = useAtomValue(userAtom)
  const { companyForm, optForms } = useCompany()

  const OptFormNames = optForms?.map((form: any) => form.name)
  const formFields = companyForm.filter((x: any) => !OptFormNames.includes(x.name))
  const formateFields = updateDependentFields(formFields || [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {
          ["root", "telecaller"].includes(user?.role.name.toLowerCase().split(" ").join("") || "") && formateFields?.map((field: any) => (
            <DropdownMenuItem key={field.id} onClick={() => onOpen("submitLead", { lead, fields: field })}>
              {field.name}
            </DropdownMenuItem>
          ))
        }
        {
          ["exchangemanager", "root"].includes(user?.role.name.toLowerCase().split(" ").join("") || "") && (
            <DropdownMenuItem onClick={() => onOpen("bidForm", { lead })}>
              Enter Bid
            </DropdownMenuItem>
          )
        }
        {
          ["financer"].includes(user?.role.name.toLowerCase().split(" ").join("") || "") && (
            <DropdownMenuItem onClick={() => onOpen("finacerBidApproval", { lead })}>
              View/Approved Bid
            </DropdownMenuItem>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
