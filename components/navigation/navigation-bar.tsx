"use client";

import { Nav } from "./nav";
import { HandCoins, HandIcon, Home, MapPin, Settings, ShoppingCart, TrendingUpIcon, Truck, User, LucideSettings, FileTextIcon } from "lucide-react";
import { TopNav } from "./top-nav";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/atom/userAtom";
import { MANAGER, ROOT, ADMIN } from "@/lib/role-constant";
import { ADMIN_NAV_LINKS, MANAGER_NAV_LINKS, ROOT_NAV_LINKS } from "@/lib/navigation-route";


export function NavigationBar({ children }: { children: React.ReactNode }) {
    const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(false)
    const handleNavToggle = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    const [user] = useAtom(userAtom)
    const role = user?.role?.name?.toLowerCase() || "";

    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");


    const EMP_NAV_LINKS = [
        {
            title: "Home",
            icon: Truck,
            href: `/${role}/leads`,
        },
        {
            title: "Transfered Leads",
            icon: HandCoins,
            href: `/${role}/leads/transfered`,
        },
        {
            title: "Broadcast",
            icon: FileTextIcon,
            href: `/${role}/leads/broadcast`,
        },
    ];

    const navLinks = [ROOT].includes(role) ? ROOT_NAV_LINKS : [ADMIN].includes(role) ? ADMIN_NAV_LINKS : [MANAGER].includes(role) ? MANAGER_NAV_LINKS : EMP_NAV_LINKS;

    useEffect(() => {   
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsNavCollapsed(true);
            } else {
                setIsNavCollapsed(false);
            }
        };

        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className="z-50">
                <div className="fixed w-full bg-[#1e2035] z-50 text-white border-b border-gray-700">
                    <TopNav toggle={handleNavToggle} />
                </div>
                <div
                    className={cn(
                        "fixed z-10 top-12 pt-2 h-full flex flex-col transition-all duration-300 ease-in-out bg-[#1e2035] items-center text-white",
                        {
                            'w-64': !isNavCollapsed,
                            'w-0': isNavCollapsed,
                            'opacity-100': !isNavCollapsed,
                            'opacity-0': isNavCollapsed,
                        }
                    )}
                >
                    <Nav isCollapsed={isNavCollapsed} links={navLinks} />
                </div>
                <div
                    className={cn(
                        "transition-all w-full duration-300 ease-in-out pt-16 md:px-4",
                        {
                            'ml-64 md:ml-0 md:pl-[17rem]': !isNavCollapsed,
                        }
                    )}
                >
                    {children}
                </div>
            </div>
        </>
    );
}