import {Request, Response} from 'express'
import { Application } from '../services/application.service';
import IApplication from '../models/IApplication';
import jwt from 'jsonwebtoken';
import { logger, jwtSecret, jwtExpiryInMilli } from '../config';
import { getChallange } from 'lds-sdk'

const registerApp = async (req: Request, res: Response) => {
    try{
        const { id } =  res.locals.data;
        console.log(req.body)
        const { name } = req.body;
        if(!name) throw new Error('App name is required!');
        const appObj = new Application({name, userId: id});
        const createdAppInDb: IApplication = JSON.parse(await appObj.create())
        res.status(200).send({ status: 200, message: createdAppInDb, error: null})
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const validateApp = async (req: Request, res: Response) => {
    try{
        const { appId, appSecret } = req.body;
        const app = new Application({appId, appSecret})
        const appsInDb = await app.fetch();
        if(appsInDb.length == 0) throw new Error(`App ${appId} does not exists. Please register.`)
        const appInDb: IApplication = appsInDb[0] as IApplication;
        if((appInDb.appId === appId) && (appInDb.appSecret === appSecret)){
            jwt.sign(
                appInDb, 
                jwtSecret, 
                { expiresIn: jwtExpiryInMilli },
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
    logger.debug('AuthServer: Inside login route')
    try{
        const appData: IApplication = res.locals.data as IApplication;
        if(!appData){
            throw new Error("App data not found")
        }
        logger.debug('AuthServer: login: AppData = ' + JSON.stringify(appData))
        const { domainName, redirect_uri } = req.body;
        logger.debug('AuthServer: login: req.body = ' + JSON.stringify({ domainName, redirect_uri }))
        if(!domainName || !redirect_uri) throw new Error('domainName and redirect_uri is required')

        const challenge = getChallange();
        const param = { appId:appData.appId, domainName, redirect_uri, challenge }

        logger.debug('Param = '+ JSON.stringify(param))
        jwt.sign(
            param, 
            jwtSecret, 
            { expiresIn: jwtExpiryInMilli },
            (err, token) => {
                if(err) throw new Error(err)
                param['challengeToken'] = token;
                let query = "?";
                Object.keys(param).forEach((k) => {
                    query += `${k}=${param[k]}&`
                })
                query = query.slice(0, query.length-1)
                logger.debug('Before redirecting to the login page....')
                const encodedURi = encodeURI(`http://localhost:5001/login${query}`)
                logger.debug('encodedURi = '+ encodedURi)
                res.status(200).send({ status: 200, message: {
                    url: encodedURi
                }, error: null})
        })
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

const getAppList = async (req: Request, res: Response) => {
    console.log(res.locals.data);
    const { name } = req.body;
    const { id } =  res.locals.data;
    if(!id) throw new Error('UserId is required!');
    const appObj = new Application({ userId: id, name: name });
    const list = await appObj.fetch()
    res.status(200).send({ status: 200, message: {
        count: list.length,
        list
    }, error: null})
}

const getOne = async(req: Request, res: Response) => {
    console.log(res.locals.data);
    const { id } =  res.locals.data;
    if(!id) throw new Error('UserId is required!');
    console.log(req.params.appId)
    console.log({userID: id})
    const appObj = new Application({ appId: req.params.appId, userId: id });
    const list = await appObj.fetch()

    // Get list of VCs
    res.status(200).send({ status: 200, message: list[0], error: null})
}

export {
    registerApp,
    validateApp,
    login,
    getAppList,
    getOne
}