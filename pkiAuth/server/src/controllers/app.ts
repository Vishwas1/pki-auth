import {Request, Response} from 'express'
import { Application } from '../services/application.service';
import IApplication from '../models/IApplication';
import jwt from 'jsonwebtoken';
import { logger, jwtSecret } from '../config';
import { getChallange } from 'lds-sdk'
const registerApp = async (req: Request, res: Response) => {
    try{
        const { name } = req.body;
        if(!name) throw new Error('App name is required!');
        const appObj = new Application({name});
        const createdAppInDb: IApplication = JSON.parse(await appObj.create())
        res.status(200).send({ status: 200, message: { appId: createdAppInDb.appId, appSecret: createdAppInDb.appSecret, appName: createdAppInDb.name}, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const validateApp = async (req: Request, res: Response) => {
    try{
        const { appId, appSecret } = req.body;
        const app = new Application({appId, appSecret})
        const appInDb: IApplication = JSON.parse(await app.fetch());
        if((appInDb.appId === appId) && (appInDb.appSecret === appSecret)){
            jwt.sign(
                appInDb, 
                jwtSecret, 
                { expiresIn: '120s' },
                (err, token) => {
                    if(err) throw new Error(err)
                    res.status(200).send({ status: 200, message: {
                        oauthToken: token,
                        appId: appInDb.appId,
                        appSecret: appInDb.appSecret,
                    }, error: null})
            })  
        }else{
            throw new Error('Unauthorized application')
        }
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const login = (req: Request, res: Response) => {
    try{
        const appData: IApplication = res.locals.data as IApplication;
        if(!appData){
            throw new Error("App data not found")
        }
        const { domainName, redirect_uri } = req.query;
        if(!domainName || !redirect_uri) throw new Error('domainName and redirect_uri is required')

        const challenge = getChallange();
        const param = { appId:appData.appId, domainName, redirect_uri, challenge }

        jwt.sign(
            param, 
            jwtSecret, 
            { expiresIn: '120s' },
            (err, token) => {
                if(err) throw new Error(err)
                param['challengeToken'] = token;
                let query = "?";
                Object.keys(param).forEach((k) => {
                    query += `${k}=${param[k]}&`
                })
                query = query.slice(0, query.length-1)
                // res.redirect(encodeURI(`http://localhost:8080/login${query}`))
                res.send({
                    url: encodeURI(`http://localhost:8080/login${query}`)
                })
        })
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

export {
    registerApp,
    validateApp,
    login
}