import { ChartColumnBigIcon, PackageIcon, ReceiptTextIcon, ShoppingCartIcon, User2 } from "@lucide/vue";
import type { Component } from "vue";

export interface IMenuItem {
    name: string;
    path?: string;
    icon?: Component;
    children?: IMenuItem[];
}
export const menuItems: IMenuItem[] = [
    {
        name: "Dashboard",
        icon: ChartColumnBigIcon,
        path: "/",
    },
    {
        name: "Products",
        icon: PackageIcon,
        children: [
            {
                name: "Product List",
                path: "/products",
            },
            {
                name: "Category List",
                path: "/products/category",
            }
        ]
    },
    {
        name: "Members",
        icon: User2,
        children: [
            {
                name: "Member List",
                path: "/members",
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
    },
    {
        name: "Orders",
        icon: ReceiptTextIcon,
        path: "/orders",
    },
];
