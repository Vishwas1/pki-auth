import { Request, Response } from 'express';
import { User } from '../services/user.service';
import IUser  from '../models/IUser'
import { logger, jwtSecret } from '../config'
import jwt from 'jsonwebtoken';
import { getChallange, verify } from 'lds-sdk'
const  {sha256hashStr} = require('../../../client/src/crypto-lib/symmetric.js')

const check = (req: Request, res: Response) => {
    res.send('/api/auth api working!')
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
        const loginType = req.query.type;
        let x: IUser = {} as any;
        let userInDb: IUser = {} as any;
        let userData: IUser = {} as any;
        let { username, password, proof, controller, publicKey, challenge, domain } = req.body;
        
        console.log(loginType)
        // Basic authenticatoin
        if(!loginType){
            if(!password || !username) throw new Error('PublicKey or password or username is empty')
            x = { password, username } as any;
            const userObj = new User(x)
            console.log(userObj)
            const userindbstr  = await userObj.fetch(false)
            console.log(userindbstr)
            if(!userindbstr) throw new Error(`Invalid user. Please register to login`)
            userInDb = JSON.parse(userindbstr)
            if((userInDb.username != username) && (userInDb.password != password)) throw new Error("Unauthorized: Username or password mismatch")
            userData = userInDb;
        }
        
        // PKI Authentcatoin: Verify the signature
        if(loginType == 'PKI'){
            console.log({proof, controller, publicKey})
            if(!proof || !controller || !publicKey || !challenge || !domain) throw new Error('proof, controller, publicKey, challenge, domain is empty')
            proof = JSON.parse(proof)
            const res = await verify({doc: proof, publicKey: publicKey, challenge, domain, controller: controller })
            if(res.verified == true){
                delete proof['proof']
                const userObj = new User({...proof,fname: proof.name, publicKey: publicKey.publicKeyBase58})    
                const userindbstr  = await userObj.fetch()
                if(!userindbstr) throw new Error(`Invalid user. Please register to login`)
                userInDb = JSON.parse(userindbstr)
                const generatedHash = sha256hashStr(JSON.stringify(proof))
                if(generatedHash != userInDb.hash) throw new Error("Unauthorized: User's hash did not match.")
                userData = proof
            }else{
                throw new Error("Unauthorized: Proof can not be verified!")
            }
        }

        // Generating Authorization token
        jwt.sign(
            userData, 
            jwtSecret, 
            { expiresIn: '30s' },
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
    res.status(200).send({ status: 200, message: getChallange() });
}

export default {
    check,
    register,
    login,
    recover,
    getNewChallenge
}