import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  profileImgUrl: string;
  password: string;
  refreshToken: string;
}

export interface UserDTO extends User {
  id: string;
}
