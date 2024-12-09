export type User = {
  _id: string,
  name: string,
  username: string,
  email: string,
  profileImg?: string,
};

export type AddUser = Omit<User, '_id'> & { password: string };

export type EditUser = User;