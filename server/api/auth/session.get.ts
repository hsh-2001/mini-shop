import { getSessionState } from "../../services/auth.service";

export default defineEventHandler(async (event) => {
  return getSessionState(event);
});
