export type User = {
  _id: string,
  name: string,
  username: string,
  email: string,
  profileImg?: File,
};

export type GetUsersResponse = {
  status: number,
  data: User[],
}

export type GetUserResponse = {
  status: number,
  data: User,
}