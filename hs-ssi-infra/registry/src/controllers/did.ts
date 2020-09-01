
import DIDMethod from '../services/didMethod.service'
import { did } from '../config';
const create = async (req, res) => {
    try{
        const  { name } = req.query
        if(!name) throw new Error('Name is required!')
        const didMethod = new DIDMethod(name);
        const newDid = await didMethod.create();
        res.status(200).send({ status: 200, message: newDid, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const update = (req, res) => {

}

const resolve = async (req, res) => {
    try{
        const  { did } = req.query
        if(!did) throw new Error('Did is required!')
        const didMethod = new DIDMethod();
        const didDoc = await didMethod.resolve(did);
        res.status(200).send({ status: 200, message: didDoc, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}


const raw = async (req, res) => {
    try{
        const  { did } = req.params
        if(!did) throw new Error('Did is required!')
        const didMethod = new DIDMethod();
        console.log(did)
        const raw = await didMethod.resolve(did);
        res.status(200).json(raw)
        // res.status(200).send({ status: 200, message: didDoc, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}


const list = async (req, res) => {
    try{
        const didMethod = new DIDMethod();
        const list = await didMethod.list();
        res.status(200).send({ status: 200, message: list, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

export default {
    create,
    update, 
    resolve,
    list,
    raw
}

