import { MongoUtils } from '../utils/mongo.utils';
import { UserModel } from '../models/user.model';
import * as mongoDB from "mongodb";
import { ObjectID } from 'bson';


export class UserDAO {
    db: mongoDB.Db
    mongoUtils = new MongoUtils();
    collectionUser = 'user';

    constructor() {
        this.mongoUtils.dbConnect().then((database: mongoDB.Db) => {
            this.db = database;
        }).catch((err) => {
            console.log('Erreur pendant l’initialisation de la BD : ' + err.message);
        });
    }

    public async getAllUsers(): Promise<UserModel[]> {
        const users = (await this.db.collection(this.collectionUser).find({}).toArray()) as UserModel[];
        return users;
    }

    public async getUserById(userID: ObjectID): Promise<UserModel> {
        const user = (await this.db.collection(this.collectionUser).find({_id:userID}).toArray()) as UserModel[];
        return user[0];
    }

    public async getByEmail(email: string): Promise<UserModel> {
        const user = (await this.db.collection(this.collectionUser).find({"email":email}).toArray()) as UserModel[];
        return user[0];
    }

    public createUser(user:UserModel) : UserModel {
        this.db.collection(this.collectionUser).insertOne(user);
        return user;
    }

    public updateUser(user: UserModel) : UserModel {
        this.db.collection(this.collectionUser).updateOne({_id:user._id},{$set:user});
        return user;
    }

    public deleteUser(userID: ObjectID): string {
        this.db.collection(this.collectionUser).deleteOne({_id:userID});
        return "L'utilisateur a bien été supprimé !";
    }
}
