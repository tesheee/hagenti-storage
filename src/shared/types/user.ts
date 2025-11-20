export interface User {
  _id?: string;
  username: string;
  email: string;
  profileImgUrl: string;
  password: string;
  refreshToken: string;
}

export interface UserDTO extends User {
  id: string;
}
