import { requireAuthenticatedUser } from "../services/auth.service";

export default defineEventHandler(async (event) => {
  const user = await requireAuthenticatedUser(event);
  return { user };
});
