import {Request, Response} from 'express'
import { VerifiableCredentials } from '../services/vc.service';
import IVerifiableCredential from '../models/IVerifiableCredentials';
import jwt from 'jsonwebtoken';
import { logger, jwtSecret, jwtExpiryInMilli } from '../config';
import { getChallange } from 'lds-sdk'

const issueCredential = async (req: Request, res: Response) => {
    try{
        // { subject = " ", id= "", issuer = " ", schemaId= " ", dataHash = " ", appId= " "}
        const { id } =  res.locals.data;
        
        const { subject, schemaId, dataHash, appId } = req.body;
        // TODO: check all the params
        const appObj = new VerifiableCredentials({ subject, schemaId, dataHash, appId, issuer: id});
        const createdAppInDb: IVerifiableCredential = JSON.parse(await appObj.create())
        // TODO: issue Vc
        const vc = ""
        res.status(200).send({ status: 200, message: createdAppInDb, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const getCredentialList = async (req: Request, res: Response) => {
    console.log(res.locals.data);
    // const { name } = req.body;
    const { id } =  res.locals.data;
    if(!id) throw new Error('UserId is required!');
    const appObj = new VerifiableCredentials({ issuer: id });
    const list = await appObj.fetch()
    res.status(200).send({ status: 200, message: {
        count: list.length,
        list
    }, error: null})
}

export {
    issueCredential,    
    getCredentialList
}