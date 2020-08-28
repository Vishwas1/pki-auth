import { ISchema, ISchemaTemplate, IAttribute, ISchemaTemplate_Schema} from '../models/ISchema';
import { getChallange, getUserDoc, sign, verify, getCredential} from 'lds-sdk';
import { DBService, SchemaType } from './db.service';
import DIDMethod from './didMethod.service'


class Attribute implements IAttribute{
    name: string;
    type: string;
    constructor(name: string){
        this.name = name;
        this.type = "string"
    }

    get(){
        const obj: any = {}
        const name = this.name;
        delete this.name
        obj[name] = this
        return this
    }
}


class SchemaTemplate implements ISchemaTemplate{
    type: string;
    modelVersion: string;
    id: string;
    name: string;
    author: string;
    authored: string;
    schema: ISchemaTemplate_Schema;
    constructor({id = "", modelVersion = "v1.0", author="", name = "", description ="", properties}){
        this.type = "https://w3c-ccg.github.io/vc-json-schemas/schema/1.0/schema.json";
        this.modelVersion = modelVersion;
        this.id = id;
        this.name = name;
        this.author  = author;
        this.authored = new Date().toString();

        this.schema = { } as ISchemaTemplate_Schema;
        this.schema.$schema = "http://json-schema.org/draft-07/schema#";
        this.schema.type = "object"
        this.schema.description = description
        this.schema.properties = {}
        this.schema.required = properties; // TODO: right now all requried... later we can change this.
        this.schema.additionalProperties = false
    
        properties.forEach(eachAttr => {
            const attrObj =  new Attribute(eachAttr)
            this.schema.properties[`${eachAttr}`] = attrObj.get()
        });

        console.log(this.schema.properties)
    }

    toString(){
        return JSON.stringify(this)
    }

}
export default class Schema implements ISchema{
    id: string;
    credentialName: string;
    attributes: string; // JSON.stringyfy(Array<String>);
    version: string;   
    owner: string; //did
    prefix: string;
    dbSerice: DBService;
    raw: string;
    description: string;
    constructor(name: string = "", owner: string, description: string = "Sample Description"){
        this.credentialName = name;
        this.owner = owner;
        this.id = "";
        this.prefix = 'sch_';
        this.attributes = '';
        this.version = "";
        this.dbSerice = new DBService();
        this.raw = ""
        this.description = description
    }

    

    private getId(){
        const uuid = this.prefix + getChallange()
        return uuid.substring(0, 20)
    }

    createRaw(id, modelVersion, author, name, description, properties){
        const newTemplate = new SchemaTemplate({id, modelVersion, author, name, description, properties})
        // console.log(newTemplate)
        return newTemplate.toString();
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
        this.raw = this.createRaw(this.id, this.version, this.owner, this.credentialName, this.description, attributes)
        console.log(this.raw)
        // TODO: store credentials in db
        const newSchema = await this.dbSerice.add(SchemaType.Schema, this);
        return newSchema;
    }

    get = async (schemaId: string) => {
        // TODO: fetch didDoc from db 
        let didInDb:ISchema  = await this.dbSerice.getOne(SchemaType.Schema, { id: schemaId, owner:  this.owner});
        return didInDb
    }

    getRaw = async (schemaId: string) => {
        let didInDb:ISchema  = await this.dbSerice.getOne(SchemaType.Schema, { id: schemaId});
        return JSON.parse(didInDb.raw)
    }
    
    list = async () => {
        console.log('Insdei list...........')
        return await this.dbSerice.getAll(SchemaType.Schema, {});
    }
}



