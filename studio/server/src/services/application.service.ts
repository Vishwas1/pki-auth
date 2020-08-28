import IApplication  from '../models/IApplication';
import { DBService, SchemaType } from './db.service';
import { getChallange } from 'lds-sdk'
export class Application implements IApplication{
    id: string;
    appId: string;
    appSecret: string;
    isActive: string;
    name: string;
    dbSerice: DBService;
    userId: string;
    prefix: string;
    constructor({ appId = " ", appSecret = " ", name = " ", userId= " ", isActive = " "}){
        this.appId = appId// new uuid
        this.id = this.appId;
        this.appSecret = appSecret;
        this.isActive = isActive;
        this.name = name;
        this.userId = userId;
        this.dbSerice = new DBService();
        this.prefix = 'app_';
    }

    toString(user: IApplication){
        return JSON.stringify(user);
    }

    private getId(){
        const uuid = this.prefix + getChallange()
        return uuid.substring(0, 20)
    }

    async create(){
        this.appId = this.getId();
        this.id = this.appId;
        this.appSecret = this.getId();
        this.isActive = "true";
        const newUser:IApplication = await this.dbSerice.add(SchemaType.Application, this);
        return this.toString(newUser)
    }

    async fetch(){
        // delete this['dbSerice']
        const props = Object.getOwnPropertyNames(this);
        let queryParams = {};
        props.forEach(e => {
            if(e == 'dbSerice') return;
            if(e == 'prefix') return;
            if(this[e] != " ") queryParams[e] = this[e]
        })
        let users = await this.dbSerice.getAll(SchemaType.Application, queryParams);
        return users
    }
}