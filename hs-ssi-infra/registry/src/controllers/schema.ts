// Ref: https://w3c-ccg.github.io/vc-json-schemas/#standards_compliance
import Schema from '../services/schema.service'
import { did } from '../config';
const create = async (req, res) => {
    try{
        const  { name, owner, attributes, description } = req.body;
        
        if(attributes.length == 0) throw new Error('Atleast one attribute is required.')
        if(!name) throw new Error('Name is required.')
        if(!owner) throw new Error('Owner DID is required.')
        
        const schemaInst = new Schema(name, owner, description);
        const newSchema = await schemaInst.create(attributes);
        res.status(200).send({ status: 200, message: newSchema, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const update = (req, res) => {

}

const get = async (req, res) => {
    try{
        const  { id, owner }  = req.query
        if(!did) throw new Error('Did is required!')
        const schemaInst = new Schema("",owner);
        const schema = await schemaInst.get(id);
        res.status(200).send({ status: 200, message: schema, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}


const list = async (req, res) => {
    try{
        const didMethod = new Schema("","");
        const list = await didMethod.list();
        res.status(200).send({ status: 200, message: list, error: null})
    }catch(e){
        console.log(e)
        res.status(500).send({ status: 500, message: null, error: e})
    }
}

const getRaw = async (req, res) => {
    try{
        const  { schemaId }  = req.params
        if(!schemaId) throw new Error("schemaId can not be empty")
        const didMethod = new Schema("","");
        const raw = await didMethod.getRaw(schemaId);
        res.status(200).json(raw) // send({ status: 200, message: raw, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}


export default {
    create,
    update, 
    get,
    list,
    getRaw
}

