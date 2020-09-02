import { Request, Response } from 'express';
import { User } from '../services/user.service';
import IUser  from '../models/IUser'
import { logger, jwtSecret, jwtExpiryInMilli } from '../config'
import jwt from 'jsonwebtoken';
import { getChallange, verify } from 'lds-sdk'
const  {sha256hashStr} = require('../../../client/src/crypto-lib/symmetric.js')
import fetch from 'node-fetch'

const check = (req: Request, res: Response) => {
    const param = {
        chJWT: "chJWT",
        challenge: "challenge",
        domain: "pkiAuth.com",
        redirect_uri: "redirect_uri"
    }

    let query = "?";
    Object.keys(param).forEach((k) => {
        query += `${k}=${param[k]}&`
    })
    query = query.slice(0, query.length-1)
    res.redirect(`http://localhost:8080/login${query}`)
}


const register = async (req: Request, res: Response) => {
    try{
        logger.debug(req.body)
        const body:IUser = req.body        
        const user = new User({...body})
        // if(user.publicKey == "") throw new Error("PublicKey field can not be null")
        const userindbstr  = await user.fetch()
        if(userindbstr) throw new Error(`User ${user.publicKey} already exists`)
        const createdU = await user.create();
        res.status(200).send({ status: 200, message: createdU, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const login = async (req: Request, res: Response) => {
    try{
        const challengeExtractedFromChToken = res.locals.data? res.locals.data.challenge : "";
        const loginType = req.query.type;
        let x: IUser = {} as any;
        let userInDb: IUser = {} as any;
        let userData: IUser = {} as any;
        let { username, password, proof, publicKey, domain } = req.body;

        // Basic authenticatoin
        if(!loginType){
            if(!password || !username) throw new Error('PublicKey or password or username is empty')
            x = { password, username } as any;
            const userObj = new User(x)
            const userindbstr  = await userObj.fetch(false)
            if(!userindbstr) throw new Error(`Invalid user. Please register to login`)
            userInDb = JSON.parse(userindbstr)
            if((userInDb.username != username) && (userInDb.password != password)) throw new Error("Unauthorized: Username or password mismatch")
            userData = userInDb;
        }
        
        // PKI Authentcatoin: Verify the signature
        if(loginType == 'PKI'){
            
            if(!proof || !domain) throw new Error('proof, controller, publicKey, challenge, domain is empty')
            proof = JSON.parse(proof)
            logger.debug(`Before verifying the proof, ch = ${challengeExtractedFromChToken}`)
            const res = await verify({doc: proof, challenge: challengeExtractedFromChToken, domain })
            logger.debug(`After verifying the proof, res = ${JSON.stringify(res)}`)
            if(res.verified == true){
                logger.debug('Proof verified')
                const id  = proof['id']
                delete proof['proof']
                // TODO:
                //      verify the did   
                //      Call http://localhost:5000/api/did/resolve?did=${id} to resolve the did
                // const res= await fetch(`http://localhost:5000/api/did/resolve/${id}`)
                // const j = await res.json()
                // Edit:  this check is not required cause, the sdk will take care of this.
                //Check if the didDoc matches with the didDoc passed here if not throw error    
                // if(JSON.stringify(j.message) === JSON.stringify(proof)){
                    const userObj = new User({...proof, username: proof['id'], id: proof['id'],fname: proof.name, publicKey: proof['publicKey'][0].id}) 
                    userData = {
                        id: userObj.id,
                        publicKey: userObj.publicKey,
                        fname: userObj.fname,
                        username: userObj.username,
                        email: userObj.email
                    }
                // }else{
                //     throw new Error("Invalid didDoc.")
                // }
            }else{
                logger.debug('Proof could not verified')
                throw new Error("Unauthorized: Proof can not be verified!")
            }
        }

        jwt.sign(
            userData, 
            jwtSecret, 
            { expiresIn: jwtExpiryInMilli },
            (err, token) => {
                if(err) throw new Error(err)
                res.status(200).send({ status: 200, message: {
                    m: "Sussfully loggedIn",
                    jwtToken: token,
                    user: userData
                }, error: null})
        })       
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const recover = (req: Request, res: Response) => {
    logger.debug('Recover ap called')
    res.send('Recover ap called!')
}

const getNewChallenge = (req: Request, res: Response) => {
    console.log('In the challenge api')
    const challenge = getChallange();
    jwt.sign(
        {challenge}, 
        jwtSecret, 
        { expiresIn: jwtExpiryInMilli },
        (err, token) => {
            if(err) throw new Error(err)
            res.status(200).send({ status: 200, message: {
                JWTChallenge: token,
                challenge}, error: null})

    })  
    // res.status(200).send({ status: 200, message: getChallange() });
}

export default {
    check,
    register,
    login,
    recover,
    getNewChallenge
}