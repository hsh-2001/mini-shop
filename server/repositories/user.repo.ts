import { ICreateUser } from "~~/types/member";
import { prisma } from "../utils/db";

export const authenticatedUserSelect = {
  id: true,
  shopId: true,
  phone: true,
  username: true,
  role: true,
  shop: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

export const countUsers = async () => {
  return prisma.user.count();
};

export const findUserByIdentifier = async (identifier: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        { username: identifier },
        { phone: identifier },
      ],
    },
    include: {
      shop: {
        select: {
          id: true,
          name: true,
          currencyBase: true,
          exchangeUSD: true,
          exchangeKHR: true,
          domains: {
            select: {
              domain: true,
              shopId: true,
              expiraryDate: true,
            }
          }
        },
      },
    }
  });
};

export const findAuthenticatedUserById = async (id: number, includePassword: boolean = false) => {
  return prisma.user.findUnique({
    where: { id },
    select: includePassword ? { ...authenticatedUserSelect, passwordHash: true } : authenticatedUserSelect,
  });
};

export const findDefaultOrderUserByShopId = async (shopId: number) => {
  return prisma.user.findFirst({
    where: { shopId },
    orderBy: [
      { role: "asc" },
      { id: "asc" },
    ],
    select: {
      id: true,
    },
  });
};

export const createInitialOwnerUser = async (input: {
  shopName: string;
  username: string;
  phone: string;
  passwordHash: string;
  domain: string;
  expiryDate?: string;
}) => {
  return prisma.user.create({
    data: {
      phone: input.phone,
      username: input.username,
      passwordHash: input.passwordHash,
      role: "OWNER",
      shop: {
        create: {
          name: input.shopName,
          domains: {
            create: {
              domain: input.domain,
              expiraryDate: input.expiryDate ?? new Date(),
            }
          }
        },
      },
    },
    select: {
      id: true,
      shopId: true,
      phone: true,
      username: true,
      role: true,
      shop: {
        select: {
          id: true,
          name: true,
          domains: {
            select: {
              domain: true,
              shopId: true,
              expiraryDate: true,
            }
          }
        },
      },
    }
  }
  )
};

export const createUser = async (request: ICreateUser) => {
  return prisma.user.create({
    data: {
      shopId: request.shopId,
      phone: request.phone,
      username: request.username,
      role: request.role,
      passwordHash: request.password,
    },
    select: {
      id: true,
    },
  });
};

export const getUsers = async (shopId: number) => {
  return prisma.user.findMany({
    where: { shopId },
  });
}

export const updateUser = async (id: number, data: Partial<ICreateUser>) => {
  return prisma.user.update({
    where: { id },
    data: {
      phone: data.phone,
      role: data.role,
    },
  });
}

export const userPasswordHash = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  return user?.passwordHash || null;
};

export const changePassword = async (userId: number, newPasswordHash: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: newPasswordHash,
    },
  });
};