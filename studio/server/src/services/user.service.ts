import IUser  from '../models/IUser';
import { DBService, SchemaType } from './db.service';
import { getChallange } from 'lds-sdk'
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
    hash: string;
    birthdate: string;
    jobTitle: string;
    prefix: string;
    constructor({ id = " ", fname = "", lname = "", username ="", phoneNumber = "", password ="", email = "", publicKey, privateKey = "", hash ="", birthdate ="", jobTitle=""}: IUser){
        this.id = id; // new uuid
        this.fname = fname;
        this.lname = lname;
        this.phoneNumber = phoneNumber;
        this.username = username;
        this.password = password; // HASH it first 
        this.email = email;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.hash = hash;
        this.birthdate = birthdate;
        this.jobTitle = jobTitle;
        this.dbSerice = new DBService();
        this.prefix = 'usr_';
    }

    toString(user: IUser){
        return JSON.stringify(user);
    }

    private getId(){
        const uuid = this.prefix + getChallange()
        return uuid.substring(0, 20)
    }
    async create(){
        this.id = this.getId();
        console.log(`User server : Creat Method::`)
        const newUser:IUser = await this.dbSerice.add<IUser>(SchemaType.User, this);
        return this.toString(newUser)
    }

    async fetch(ifPki = true){
        let obj= {}
        if(ifPki){
            obj = {username: this.username, password: this.password, publicKey: this.publicKey}
        }else{
            obj = {username: this.username, password: this.password}
        }
        let user:IUser = await this.dbSerice.getOne(SchemaType.User, obj);
        return this.toString(user)
    }
}