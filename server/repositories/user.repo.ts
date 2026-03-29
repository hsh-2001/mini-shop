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
  });
};

export const findAuthenticatedUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: authenticatedUserSelect,
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

export const createInitialAdminUser = async (input: {
  shopName: string;
  username: string;
  phone: string;
  passwordHash: string;
}) => {
  return prisma.user.create({
    data: {
      phone: input.phone,
      username: input.username,
      passwordHash: input.passwordHash,
      role: "ADMIN",
      shop: {
        create: {
          name: input.shopName,
        },
      },
    },
    select: {
      id: true,
    },
  });
};
