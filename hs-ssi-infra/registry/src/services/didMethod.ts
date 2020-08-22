import IDID from '../models/IDID';
import { getChallange, getUserDoc, sign, verify, getCredential} from 'lds-sdk';
import { DBService, SchemaType } from './db.service';


export default class DIDMethod implements IDID{
    did: string;
    didDoc: string;
    name: string;
    dbSerice: DBService;
    id: string;
    constructor(name : string = ""){
        // TODO: check if this name is alreay present in db otherwise throw error
        this.name = name;
        this.did = "";
        this.id = "";
        this.didDoc = "";
        this.dbSerice = new DBService();
    }

    create = async () => {
        const credential = await getCredential(this.name)
        this.did = credential.controller.id;
        this.id = this.did;
        this.didDoc = JSON.stringify(credential.controller);
        // TODO: store credentials in db
        await this.dbSerice.add(SchemaType.Did, this);
        return {
            keys: credential.keys,
            did: this.did,
            didDoc: credential.controller
        }
    }

    resolve = async (did: string) => {
        // TODO: fetch didDoc from db 
        let didInDb:IDID  = await this.dbSerice.getOne(SchemaType.Did, { did});
        return JSON.parse(didInDb.didDoc)
    }
}



