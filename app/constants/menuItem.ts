import { ChartColumnBigIcon, PackageIcon, ReceiptTextIcon, Settings, ShoppingCartIcon, User2 } from "@lucide/vue";
import type { Component } from "vue";
import type { UserRole } from "~~/prisma/generated/enums";

export interface IMenuItem {
    name: string;
    path?: string;
    icon?: Component;
    allowRoles?: UserRole[];
    children?: IMenuItem[];
}
export const menuItems: IMenuItem[] = [
    {
        name: "Dashboard",
        icon: ChartColumnBigIcon,
        path: "/",
        allowRoles: ["OWNER", "ADMIN", "MANAGER"],
    },
    {
        name: "Products",
        icon: PackageIcon,
        allowRoles: ["OWNER", "ADMIN", 'MANAGER'],
        children: [
            {
                name: "Product List",
                path: "/products",
                allowRoles: ["OWNER", "ADMIN", 'MANAGER'],
            },
            {
                name: "Category List",
                path: "/products/category",
                allowRoles: ["OWNER", "ADMIN", 'MANAGER'],
            }
        ]
    },
    {
        name: "Members",
        icon: User2,
        allowRoles: ["OWNER", "ADMIN"],
        children: [
            {
                name: "Member List",
                path: "/members",
                allowRoles: ["OWNER", "ADMIN"],
            },
            // {
            //     name: "Add/Edit Member",
            //     path: "/members/add-edit",
            // }
        ]

    },
    {
        name: "Cashier",
        icon: ShoppingCartIcon,
        path: "/cashier",
        allowRoles: ["OWNER", "ADMIN", 'CASHIER'],
    },
    {
        name: "Orders",
        icon: ReceiptTextIcon,
        path: "/orders",
        allowRoles: ["OWNER", "ADMIN", 'CASHIER', 'MANAGER'],
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/settings",
        allowRoles: ["OWNER", "ADMIN"],
    }
];
