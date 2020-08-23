import ISchema from '../models/ISchema';
import { getChallange, getUserDoc, sign, verify, getCredential} from 'lds-sdk';
import { DBService, SchemaType } from './db.service';
import DIDMethod from './didMethod.service'

export default class Schema implements ISchema{
    id: string;
    credentialName: string;
    attributes: string; // JSON.stringyfy(Array<String>);
    version: string;   
    owner: string; //did
    prefix: string;
    dbSerice: DBService;
    constructor(name: string = "", owner: string){
        this.credentialName = name;
        this.owner = owner;
        this.id = "";
        this.prefix = 'sch_';
        this.attributes = '';
        this.version = "";
        this.dbSerice = new DBService();
    }

    

    private getId(){
        const uuid = this.prefix + getChallange()
        return uuid.substring(0, 20)
    }


    create = async (attributes: Array<string>) => {
        // TODO: resolve this owner to check if he exists
        const meth = new DIDMethod()
        
        const didDoc = await meth.resolve(this.owner);
        console.log(didDoc)
        if(!didDoc || Object.keys(didDoc).length == 0) throw new Error(`Did can not resolve: ${this.owner}`)

        this.id = this.getId();
        this.attributes  = JSON.stringify(attributes);
        this.version = '1.0'
        // TODO: store credentials in db
        const newSchema = await this.dbSerice.add(SchemaType.Schema, this);
        return newSchema;
    }

    get = async (schemaId: string) => {
        // TODO: fetch didDoc from db 
        let didInDb:ISchema  = await this.dbSerice.getOne(SchemaType.Schema, { id: schemaId, owner:  this.owner});
        return didInDb
    }

    list = async () => {
        return await this.dbSerice.getAll(SchemaType.Schema, {});
    }
}



