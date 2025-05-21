export type UserData = {
  _id: string;
  email: string;
  name: string;
  isActive: boolean;
};

export type LoginResponse = {
  status: number;
  message: string;
  token: string;
  user: UserData;
};