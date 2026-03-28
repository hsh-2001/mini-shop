import { logout } from "../../services/auth.service";

export default defineEventHandler(async (event) => {
  return logout(event);
});
