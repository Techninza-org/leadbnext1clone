import { FileTextIcon, Home, UsersRoundIcon } from "lucide-react";

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
        href: "/leads",
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
