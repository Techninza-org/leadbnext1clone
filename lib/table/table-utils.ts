import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircle2,
    CircleIcon,
    CrossIcon,
    LucideMessageCircleQuestion,
    LucideWatch,
  } from "lucide-react"
  
  export const labels = [
    {
      value: "bug",
      label: "Bug",
    },
    {
      value: "feature",
      label: "Feature",
    },
    {
      value: "documentation",
      label: "Documentation",
    },
  ]
  
  export const statuses = [
    {
      value: "PENDING",
      label: "Pending",
      icon: LucideMessageCircleQuestion,
    },
    {
      value: "todo",
      label: "Todo",
      icon: CircleIcon,
    },
    {
      value: "in progress",
      label: "In Progress",
      icon: LucideWatch,
    },
    {
      value: "done",
      label: "Done",
      icon: CheckCircle2,
    },
    {
      value: "canceled",
      label: "Canceled",
      icon: CrossIcon,
    },
  ]
  
  export const priorities = [
    {
      label: "Low",
      value: "low",
      icon: ArrowDownIcon,
    },
    {
      label: "Medium",
      value: "medium",
      icon: ArrowRightIcon,
    },
    {
      label: "High",
      value: "high",
      icon: ArrowUpIcon,
    },
  ]
  