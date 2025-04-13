"use client"

import React from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import ActionTooltip from "../action-tooltip"
import { usePathname } from "next/navigation"
import { useCompany } from "../providers/CompanyProvider"

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: LucideIcon
    href?: string
    isDropdown?: boolean
    subLinks?: {
      title: string
      href: string
    }[]
  }[]
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname()
  const [openDropdownIndex, setOpenDropdownIndex] = React.useState<number | null>(null)
  const { departments } = useCompany()

  const isActive = (href: string) => {
    return pathname.includes(href.toLowerCase()) ? "default" : "ghost"
  }

  const handleDropdownToggle = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  }

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 w-full"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const isDropdownOpen = openDropdownIndex === index
          const DropDownToggleIcon = isDropdownOpen ? ChevronUp : ChevronDown

          if (link.isDropdown) {
            return isCollapsed ? (
              <ActionTooltip
                key={index}
                side="right"
                align="start"
                label={link.title}
              >
                <Button
                  type="button"
                  variant={isActive(link.title)}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleDropdownToggle(index)}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only capitalize">{link.title}</span>
                </Button>
              </ActionTooltip>
            ) : (
              <div key={index} className="space-y-1">
                <Button
                  type="button"
                  variant={isActive(link.title)}
                  size="sm"
                  className="w-full justify-start capitalize"
                  onClick={() => handleDropdownToggle(index)}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                  <DropDownToggleIcon className="ml-auto h-4 w-4" />
                </Button>
                {isDropdownOpen && departments && (
                  <div className="ml-4 space-y-1">
                    {departments.map((dept: any, deptIndex: number) => (
                      <Link
                        key={deptIndex}
                        href={`/department/${dept.id}`}
                        className={cn(
                          buttonVariants({ variant: isActive(`/department/${dept.id}`), size: "sm" }),
                          "w-full justify-start capitalize"
                        )}
                      >
                        {dept.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return isCollapsed ? (
            <ActionTooltip
              key={index}
              side="right"
              align="start"
              label={link.title}
            >
              {link.href ? (
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: isActive(link.href), size: "icon" }),
                    "h-9 w-9"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only capitalize">{link.title}</span>
                </Link>
              ) : (
                <Button
                  type="button"
                  variant={isActive(link.title)}
                  size="icon"
                  className="h-9 w-9"
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only capitalize">{link.title}</span>
                </Button>
              )}
            </ActionTooltip>
          ) : (
            <Link
              key={index}
              href={link.href || "#"}
              className={cn(
                buttonVariants({ variant: isActive(link.href || ""), size: "sm" }),
                "justify-start capitalize"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span className="ml-auto">
                  {link.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}