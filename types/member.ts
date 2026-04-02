import type { UserRole } from "~~/prisma/generated/enums";

export interface ICreateUser {
    shopId: number;
    username: string;
    phone: string;
    isActive?: boolean;
    password: string;
    role: UserRole;
};

export type TMemberResponse = ICreateUser & {
    id: number;
    createdOn: string;
    updatedOn: string;
};

export class MemberResponse implements TMemberResponse {
    id: number;
    shopId: number;
    username: string;
    phone: string;
    password: string;
    isActive?: boolean;
    role: UserRole;
    createdOn: string;
    updatedOn: string;

    constructor(props: TMemberResponse) {
        this.id = props.id;
        this.shopId = props.shopId;
        this.username = props.username;
        this.phone = props.phone;
        this.password = props.password;
        this.role = props.role;
        this.createdOn = props.createdOn;
        this.updatedOn = props.updatedOn;
        this.isActive = props.isActive;
    }

    get formattedCreatedOn() {
        return new Date(this.createdOn).toLocaleString();
    }
    
    get formattedUpdatedOn() {
        return new Date(this.updatedOn).toLocaleString();
    }
}