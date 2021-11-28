import { UserModel, UserWithToken } from "../models/user.model";
import { UserDAO } from "../dao/user.dao";
import { UnknownUserError } from "../errors/unknown-user.error";
import * as mongoDB from "mongodb";
import { ObjectID } from 'bson';
import { TokenModel } from "../models/token.model";

const jwt = require('jsonwebtoken');
const config = process.env;

export class UserService {
    private userDAO: UserDAO = new UserDAO()

    public async getAllUsers() : Promise<UserModel[]> {
        return this.userDAO.getAllUsers();
    }

    public async getUserById(userID: string) : Promise<UserModel> {
        const user = await this.userDAO.getUserById(new ObjectID(userID));
        if (!user) {
            throw new UnknownUserError('unknown user');
        }
        return user;
    }

    public async createUser(user: UserModel) {
        const emailExist = await this.userDAO.getByEmail(user.email);
        const userToCreate = {
            ...user,
            _id: new mongoDB.ObjectId(),
        }
        if (!this.checkUserToCreateIsValid(user)) {
            throw new Error('invalid user');
        }
        if (emailExist) {
            throw new Error('Cette utilisateur ayant comme email : ' + user.email + ", existe déjà ! De ce fait, nous ne pouvons pas le créer.");
        }
        return this.userDAO.createUser(userToCreate);
    }

    public async updateUser(userID:string, user: UserModel): Promise<UserModel> {
        const existingUser = await this.userDAO.getUserById(new ObjectID(userID));
        if (!existingUser) {
            throw new UnknownUserError('unknown user')
        }
        const userToUpdate = {
            ...existingUser,
            ...user
        }
        return this.userDAO.updateUser(userToUpdate);
    }

    public deleteUser(userID: string) {
        const user = this.userDAO.getUserById(new ObjectID(userID));

        user.then((result) => {
            if (!result) {
                throw new UnknownUserError('unknown user');
            }
            return this.userDAO.deleteUser(new ObjectID(userID));
        });
    }

    public async login(email: string, password: string): Promise<UserWithToken> {
        if (!email || !password) {
            throw new Error('all inputs are required');
        }
        const user = await this.userDAO.getByEmail(email);
        if (user && user.password === password) {
            const token = jwt.sign(
                user,
                process.env.TOKEN_KEY,
                {
                    expiresIn: "24h"
                }
            );
            const userLoged: UserWithToken = {
                ...user,
                token
            }
            return userLoged;
        } else {
            throw new UnknownUserError()
        }
    }

    public verifyToken(token: TokenModel) {
        const tokenUser = token.token;
        if (!tokenUser) {
            throw new Error("A token is required for authentication");
        }
        try {
            const decoded = jwt.verify(tokenUser, config.TOKEN_KEY);
            return decoded;
        } catch (err) {
            throw new Error("Invalid Token");
        }
    }

    private checkUserToCreateIsValid(user: UserModel) {
        return user && user.email && user.password && user.first_name && user.last_name
    }
}