import IApplication  from '../models/IApplication';
import { DBService, SchemaType } from './db.service';
import { getChallange } from 'lds-sdk'
export class Application implements IApplication{
    id: string;
    appId: string;
    appSecret: string;
    isActive: string;
    dbSerice: DBService;
    constructor(){
        this.appId = getChallange(); // new uuid
        this.id = this.appId;
        this.appSecret = getChallange();
        this.isActive = "true";
        this.dbSerice = new DBService();
    }

    toString(user: IApplication){
        return JSON.stringify(user);
    }

    async create(){
        const newUser:IApplication = await this.dbSerice.add(SchemaType.Application, this);
        return this.toString(newUser)
    }

    async fetch(){
        let user:Application = await this.dbSerice.getOne(SchemaType.Application, {appId: this.appId});
        return this.toString(user)
    }
}