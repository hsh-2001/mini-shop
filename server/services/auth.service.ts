import { ICreateUser } from './../../types/member';
import bcrypt from "bcryptjs";
import type { H3Event } from "h3";
import {
  changePassword,
  countUsers,
  createInitialOwnerUser,
  createUser,
  findAuthenticatedUserById,
  findUserByIdentifier,
  getUsers,
  updateUser,
  userPasswordHash,
} from "../repositories/user.repo";
import {
  clearSessionCookie,
  getSessionUserId,
  setSessionCookie,
} from "./session.service";
import { validateLogin } from "../utils/vaiditionChance";
import { UserRole } from '~~/prisma/generated/enums';
import { User } from '~~/prisma/generated/client';

export type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof findAuthenticatedUserById>>>;

const SALT_ROUNDS = 12;

const getSafeErrorMessage = (error: unknown) => {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "";
};


export const getSessionState = async (event: H3Event) => {
  const [user, userCount] = await Promise.all([
    getAuthenticatedUser(event),
    countUsers(),
  ]);

  return {
    user,
    setupRequired: userCount === 0,
  };
};

export const getAuthenticatedUser = async (event: H3Event): Promise<AuthenticatedUser | null> => {
  const userId = getSessionUserId(event);

  if (!userId) {
    clearSessionCookie(event);
    return null;
  }

  const user = await findAuthenticatedUserById(userId);

  if (!user) {
    clearSessionCookie(event);
    return null;
  }

  return user;
};

export const requireAuthenticatedUser = async (event: H3Event) => {
  const user = await getAuthenticatedUser(event);

  if (!user) {
    throw new Error("Authentication required. Please log in to access this resource.");
  }

  return user;
};

export const login = async (
  event: H3Event,
  input: {
    identifier: string;
    password: string;
  },
  domain: string,
) => {
  const errorMessage = await validateLogin(input);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const user = await findUserByIdentifier(input.identifier);

  if (!user?.isActive) {
    throw new Error("User account is closed");
  }

  if (!user?.shop?.domains?.some((d) => d.domain === domain)) {
    throw new Error("Invalid domain for the user.");
  }
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new Error("Invalid username/phone or password.");
  }

  setSessionCookie(event, user);
  return {
    id: user.id,
    shopId: user.shopId,
    phone: user.phone,
    username: user.username,
    role: user.role,
    createdOn: user.createdOn,
    updatedOn: user.updatedOn,
    shop: user.shop,
    currencyBase: user.shop.currencyBase,
    exchangeUSD: user.shop.exchangeUSD,
    exchangeKHR: user.shop.exchangeKHR,
  };
};

export const logout = async (event: H3Event) => {
  clearSessionCookie(event);

  return {
    ok: true,
  };
};

export const registerInitialOwner = async (
  event: H3Event,
  input: {
    shopName: string;
    username: string;
    phone: string;
    password: string;
    domain: string;
    expiryDate: string;
  },
) => {
  const identifier = input.username || input.phone;
  const validationMessage = await validateLogin({ identifier, password: input.password });
  if (validationMessage) {
    throw new Error(validationMessage);
  }

  if (input.password && input.password.length < 6) {
    throw new Error("Password must be at least 8 characters.");
  }

  try {
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await createInitialOwnerUser({
      shopName: input.shopName,
      username: input.username,
      phone: input.phone,
      passwordHash,
      domain: input.domain,
      expiryDate: input.expiryDate,
    });
    setSessionCookie(event, { id: user.id, username: user.username, phone: user.phone, shopId: user.shopId });
    return user;
  } catch (error) {
    const message = getSafeErrorMessage(error);
    if (message.includes("Unique constraint")) {
      throw new Error("Username, phone,shop name, or domain already exists.");
    }

    throw error;
  }
};


export const createUserService = async (req: ICreateUser) => {
  const identifier = req.username || req.phone;
  const validationMessage = await validateLogin({ identifier, password: req.password });
  if (validationMessage) {
    throw new Error(validationMessage);
  }
  if (!req.role) {
    throw new Error("User role is required.");
  }
  if (!Object.values(UserRole).includes(req.role) || req.role === UserRole.OWNER) {
    throw new Error("Invalid user role.");
  }
  const passwordHash = await bcrypt.hash(req.password, SALT_ROUNDS);
  req.password = passwordHash;
  return await createUser(req);
};

export const getUsersService = async (shopId: number) => {
  const users = await getUsers(shopId);
  return users.map(user => ({
    id: user.id,
    shopId: user.shopId,
    phone: user.phone,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
    createdOn: user.createdOn,
    updatedOn: user.updatedOn,
  }));
}

export const updateUserService = async (id: number, data: Partial<ICreateUser>) => {
  return await updateUser(id, data);
}


export const changePasswordService = async (shopId: number, userId: number, input: { currentPassword: string; newPassword: string }) => {
  const passwordHash = await userPasswordHash(userId);

  if (!passwordHash) {
    throw new Error("User not found.");
  }

  if (!(await bcrypt.compare(input.currentPassword, passwordHash))) {
    throw new Error("Current password is incorrect.");
  }

  const newPasswordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
  await changePassword(userId, newPasswordHash);
};