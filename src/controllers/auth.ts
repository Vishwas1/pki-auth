import { Request, Response } from 'express';
import { User } from '../services/user.service';
import IUser  from '../models/IUser'
import { logger, jwtSecret } from '../config'
import jwt from 'jsonwebtoken';

const check = (req: Request, res: Response) => {
    res.send('/api/auth api working!')
}

const register = async (req: Request, res: Response) => {
    try{
        const body:IUser = req.body
        const user = new User({...body})
        const createdU = await user.create();
        res.status(200).send({ status: 200, message: createdU, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const login = async (req: Request, res: Response) => {
    try{
        const { publicKey, password, username } = req.body;
        if(!publicKey || !password || !username) throw new Error('PublicKey or password or username is empty');
        let x: IUser = { publicKey, password, username } as any;
        
        const user = new User(x)
        const userindbstr  = await user.fetch()
        if(!userindbstr) throw new Error(`User ${publicKey} does not exist. Please register to login.`)

        const userindb: IUser = JSON.parse(userindbstr)
        
        if((userindb.username === username) && (userindb.password === password)){
            jwt.sign(
                userindb, 
                jwtSecret, 
                { expiresIn: 30000 },
                (err, token) => {
                if(err) throw new Error(err)
                res.status(200).send({ status: 200, message: {
                    m: "Sussfully loggedIn",
                    jwtToken: token
                }, error: null})
            })
        }else{
            throw new Error("Username or password mismatch");
        }        
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const recover = (req: Request, res: Response) => {
    logger.info('Recover ap called')
    res.send('Recover ap called!')
}

export default {
    check,
    register,
    login,
    recover
}