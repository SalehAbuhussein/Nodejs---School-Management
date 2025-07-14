export type UserData = {
  _id: string;
  email: string;
  name: string;
  isActive: boolean;
};

export type UserInfoResponse = {
  status: number;
  message: string;
  data: UserData;
};
