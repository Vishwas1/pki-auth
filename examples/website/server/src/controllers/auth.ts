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
        const challengeExtractedFromChToken = res.locals.data? res.locals.data.challenge : "";
        console.log(challengeExtractedFromChToken)
        const loginType = req.query.type;
        let x: IUser = {} as any;
        let userInDb: IUser = {} as any;
        let userData: IUser = {} as any;
        let { username, password, proof, controller, challenge, publicKey, domain } = req.body;

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
            
            if(!proof || !controller || !publicKey  || !domain) throw new Error('proof, controller, publicKey, challenge, domain is empty')
            proof = JSON.parse(proof)
            logger.debug(`Before verifying the proof, ch = ${challengeExtractedFromChToken}`)
            const res = await verify({doc: proof, publicKey: publicKey, challenge: challengeExtractedFromChToken, domain, controller: controller })
            logger.debug(`After verifying the proof, res = ${JSON.stringify(res)}`)
            if(res.verified == true){
                logger.debug('Proof verified')
                delete proof['proof']
                const userObj = new User({...proof,fname: proof.name, publicKey: publicKey.publicKeyBase58})    
                const userindbstr  = await userObj.fetch()
                if(!userindbstr) throw new Error(`Invalid user. Please register to login`)
                userInDb = JSON.parse(userindbstr)
                const generatedHash = sha256hashStr(JSON.stringify(proof))
                if(generatedHash != userInDb.hash) throw new Error("Unauthorized: User's hash did not match.")
                userData = proof
            }else{
                logger.debug('Proof could not verified')
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
    const challenge = getChallange();
    jwt.sign(
        {challenge}, 
        jwtSecret, 
        { expiresIn: '30s' },
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