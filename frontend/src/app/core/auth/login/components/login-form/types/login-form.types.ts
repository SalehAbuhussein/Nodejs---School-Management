import { FormField } from "app/shared/types/form.types";

export type LoginForm = Record<'email' | 'password', FormField>;

export type LoginResponse = {
  message: string;
  token: string;
  status: number;
  user: {
    _id: string;
    email: string;
    name: string;
    isActive: boolean;
  }
};