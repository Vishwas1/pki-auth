import env from 'dotenv'
import sqlite from 'sqlite3';
import path from 'path';
import fs from 'fs'
const log = require('simple-node-logger');


env.config();

const log_dir = path.resolve(__dirname,'../log')
const db_dir = path.resolve(__dirname,'../db')

if(!fs.existsSync(log_dir)) fs.mkdirSync(log_dir)
if(!fs.existsSync(db_dir)) fs.mkdirSync(db_dir)

// LOGGING
const log_path = path.resolve(__dirname, process.env.LOG_FILEPATH || 'ssi-infra.log')
const logger = log.createSimpleLogger({
    logFilePath: log_path,
    timestampFormat: process.env.LOG_TIMESTAMP_FORMAT || 'YYYY-MM-DD HH:mm:ss.SSS'
})
logger.setLevel(process.env.LOG_LEVEL || 'info')

const port = process.env.PORT || 5000


// DATABASE
// Ref: https://www.sqlitetutorial.net/sqlite-nodejs/
const db_file_path = process.env.DATABASE_FILEPATH || 'ssi.db'; 
const db_path = path.resolve(__dirname, db_file_path)
const db =  new sqlite.Database(db_path, (err) => {
    if(err){
        logger.error(`SQLite db error:  ${err.message}`)
    }else{
        logger.info(`Connected to ssi-infa database. DB path = ${db_path}`)
    }
});

// DID Related
const did = {
    sheme : process.env.DID_SCHEME || 'did',
    method : process.env.DID_METHOD_NAME || 'hypersign',
}

const jwtSecret = process.env.JWT_SECRET || 'secretKey'
const jwtExpiryInMilli = 240000


// AuthServer configurations
const hypersign_auth_config = {
    auth_server_url: process.env.AUTH_SERVER_URL || 'http://localhost:5000/api/app',
}
hypersign_auth_config['oauthAPI'] = {
    method: 'POST',
    uri: `${hypersign_auth_config.auth_server_url}/oauth`,
    params: ['appId','appSecret'],
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

hypersign_auth_config['loginPageAPI'] = {
    method: 'POST',
    uri: `${hypersign_auth_config.auth_server_url}/login`,
    params: ['domainName', 'redirect_uri'],
    headers: {
        'x-auth-token': "",
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

const hypersign_app_config = {
    appId: "app_0598e629-78fb-49",
    appSecret: "app_ab08bf75-0975-40",
    redirect_uri: "http://localhost:9000/api/auth/login/callback",
    domainName: "http://localhost:9000"
}
export  {
    port,
    logger,
    db,
    did,
    jwtSecret,
    jwtExpiryInMilli,
    hypersign_auth_config,
    hypersign_app_config
}