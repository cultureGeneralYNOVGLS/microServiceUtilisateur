import { ObjectId } from "bson"

export interface UserModel {
    _id: ObjectId;
    last_name: string;
    first_name: string;
    email: string;
    password: string;
}

export interface UserWithToken extends UserModel {
    token: string;
}