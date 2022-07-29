import moment from "moment";
import { Schema, model } from "mongoose";
import 'moment/locale/pt-br'

interface User {
  email: string;
  name: string;
  admin: boolean;
  birth: string;
  gender: string;
  password: string;
  createdAt: Date;
}


const schema = new Schema<User>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  birth: {type: String, required: true},
  admin: {type: Boolean, default: false},
  gender: {type: String, required: true},
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = model<User>("User", schema);
