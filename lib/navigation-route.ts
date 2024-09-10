import { FileTextIcon, HandCoins, Home, Pencil, Pin, Settings, UsersRoundIcon } from "lucide-react";

export const ROOT_NAV_LINKS = [
    {
        title: "Home",
        icon: Home,
        href: "/dashboard",
    },
    {
        title: "Leads",
        icon: FileTextIcon,
        href: "/leads",
    },
    {
        title: "Members",
        icon: UsersRoundIcon,
        href: "/members",
    },
    // {
    //     title: "Assign Lead",
    //     icon: ShoppingCart,
    //     subLinks: [
    //         {
    //             title: "Forward Orders",
    //             href: "/orders",
    //         },
    //         {
    //             title: "Reverse Orders",
    //             href: "/orders/reverse",
    //         },
    //         {
    //             title: "B2B Orders",
    //             href: "/orders/b2b",
    //         },
    //     ],
    // },
];

export const MANAGER_NAV_LINKS = [
    {
        title: "Home",
        icon: Home,
        href: "/dashboard",
    },
    {
        title: "Prospects",
        icon: FileTextIcon,
        href: "/leads",
    },
    {
        title: "Leads",
        icon: FileTextIcon,
        href: "/leads/transfered",
    },
    {
        title: "Track Location",
        icon: Pin,
        href: "/track",
    },
    // {
    //     title: "Assign Lead",
    //     icon: ShoppingCart,
    //     subLinks: [
    //         {
    //             title: "Forward Orders",
    //             href: "/orders",
    //         },
    //         {
    //             title: "Reverse Orders",
    //             href: "/orders/reverse",
    //         },
    //         {
    //             title: "B2B Orders",
    //             href: "/orders/b2b",
    //         },
    //     ],
    // },
];

export const ADMIN_NAV_LINKS = [
    {
        title: "Home",
        icon: Home,
        href: "/admin/dashboard",
    },
    {
        title: "Companies",
        icon: FileTextIcon,
        href: "/admin/companies",
    },
    {
        title: "Settings",
        icon: Settings,
        href: "/admin/settings",
    },
    // {
    //     title: "Create",
    //     icon: Pencil,
    //     href: "/admin/create",
    // },
]