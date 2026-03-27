import { getPrisma } from "../utils/db";

export default defineCachedEventHandler(async (event) => {
  const prisma = getPrisma();
  const user = await prisma.user.findMany();
  return user;
});
