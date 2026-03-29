import { ChartColumnBigIcon, PackageIcon, ReceiptTextIcon, ShoppingCartIcon, User2 } from "@lucide/vue";
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
        allowRoles: ["ADMIN"],
    },
    {
        name: "Products",
        icon: PackageIcon,
        allowRoles: ["ADMIN"],
        children: [
            {
                name: "Product List",
                path: "/products",
                allowRoles: ["ADMIN"],
            },
            {
                name: "Category List",
                path: "/products/category",
                allowRoles: ["ADMIN"],
            }
        ]
    },
    {
        name: "Members",
        icon: User2,
        allowRoles: ["ADMIN"],
        children: [
            {
                name: "Member List",
                path: "/members",
                allowRoles: ["ADMIN"],
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
        allowRoles: ["ADMIN", 'CASHIER'],
    },
    {
        name: "Orders",
        icon: ReceiptTextIcon,
        path: "/orders",
        allowRoles: ["ADMIN", 'CASHIER'],
    },
];
