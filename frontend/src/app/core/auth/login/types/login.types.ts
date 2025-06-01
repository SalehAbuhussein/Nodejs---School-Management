import { UserData } from "app/core/auth/shared/services/user/user.types";

export type LoginResponse = {
  status: number;
  message: string;
  token: string;
  user: UserData;
};