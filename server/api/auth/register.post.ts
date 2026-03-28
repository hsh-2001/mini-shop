import { fail } from "~~/types/baseApi";
import { registerInitialOwner } from "../../services/auth.service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    return await registerInitialOwner(event, body);
  } catch (error) {
    if (error instanceof Error) {
      return fail(error.message, 400);
    }
    return fail("Internal server error", 500);
  }
});
