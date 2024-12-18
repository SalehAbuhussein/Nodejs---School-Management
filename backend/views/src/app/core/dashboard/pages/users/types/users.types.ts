export type User = {
  _id: string,
  name: string,
  username: string,
  email: string,
  profileImg?: string,
};

export type GetUsersResponse = {
  status: number,
  data: User[],
};

export type GetUserResponse = {
  status: number,
  data: User,
};

export type DeleteUserResponse = {
  message: string,
  error: any,
};

export type AddUserResponse = {
  error?: any, 
  status: number,
  data: User | null,
  message: string
};

export type EditUserResponse = {
  data: User | null,
  error?: any | null,
};