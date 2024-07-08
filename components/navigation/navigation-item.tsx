"use client"

import * as React from "react"
import Link from "next/link"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavigationItem({ links }: { links: { label: string; href: string }[] }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const status = searchParams.get("status")
    return (
        <NavigationMenu>
            <NavigationMenuList>
                {links.map((link, index) => {
                    const isActive = status ? link.href === `/orders?status=${status}` : link.href === pathname;
                    const isLastItem = index === links.length - 1;
                    return (
                        <NavigationMenuItem key={link.label}>
                            <Link href={link.href} passHref legacyBehavior>
                                <NavigationMenuLink
                                    className={cn(
                                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900",
                                        isActive ? "text-red-500 font-medium bg-gray-100 shadow-sm" : "",
                                        // isLastItem ? cn(buttonVariants({
                                        //     variant: "themeButton",
                                        //     size: "sm",
                                        // }), "hover:text-white") : ""
                                    )}
                                >
                                    {link.label}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export function RevOrderFilter({ links, handleRevFilter }: { links: { label: string; bucket?: number }[], handleRevFilter: (bucket: number | undefined) => void }) {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                {links.map((link) => {
                    // const isActive = status ? link.href === `/orders?status=${status}` : link.href === pathname;
                    return (
                        <NavigationMenuItem key={link.label}>
                            <button onClick={() => { handleRevFilter(link.bucket) }}>
                                <NavigationMenuLink
                                    className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900",
                                        // isActive ? "text-red-500 font-medium bg-gray-100 shadow-sm" : ""
                                    )}
                                >
                                    {link.label}
                                </NavigationMenuLink>
                            </button>
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

