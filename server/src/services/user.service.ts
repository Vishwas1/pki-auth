import IUser  from '../models/IUser';
import { schemaType, DBService } from './db.service';
export class User implements IUser{
    id: string;
    fname: string;
    lname: string;
    phoneNumber: string;
    username: string;
    password: string;
    email: string;
    publicKey: string;
    privateKey: string;
    dbSerice: DBService;
    
    constructor({ fname = "", lname = "", username, phoneNumber = "", password, email = "", publicKey, privateKey = ""}: IUser){
        this.id = ""; // new uuid
        this.fname = fname;
        this.lname = lname;
        this.phoneNumber = phoneNumber;
        this.username = username;
        this.password = password; // HASH it first 
        this.email = email;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.dbSerice = new DBService();
    }

    toString(user: IUser){
        return JSON.stringify(user);
    }

    async create(){
        const newUser:IUser = await this.dbSerice.add(schemaType.USER, this);
        return this.toString(newUser)
    }

    async fetch(){
        const user:IUser = await this.dbSerice.getOne(schemaType.USER, {publicKey: this.publicKey});
        return this.toString(user)
    }
}