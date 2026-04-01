import { success, fail } from './../../../types/baseApi';
import { login } from "../../services/auth.service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const ulr = getRequestURL(event);
  const domain = ulr.hostname;
  try {
    const result = await login(event, body, domain);
    return success(result, "Login successful");
  } catch (error) {
    if (error instanceof Error) {
      return fail(error.message, 400);
    }
    return fail("Internal server error", 500);
  }
});
