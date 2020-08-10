import { CREATE_USER_TABLE, ADD_USER, GET_USER, DROP_USER_TABLE } from './db.query'
import IUser from '../models/IUser';
import { db, logger } from '../config'
import { resolve } from 'path';
export enum schemaType {
    USER
}

export class DBService{
    constructor(){
        logger.info('Method: constructor: DBService constructor');
        if(!db) throw new Error("Invalid database connection.")
    }

    dropTable (type: schemaType): Promise<string>{
        return new Promise((resolve, reject)=>{
            if(type === schemaType.USER){
                logger.debug('Method: createTable: Before dropTable User table: query = ', DROP_USER_TABLE);
                db.run(DROP_USER_TABLE,(err, res) =>{
                    if(err) reject('ERROR')
                    logger.debug('Method: createTable: After dropTable User table res = ', res)
                    return resolve("SUCCESS")
                })
            }
        })
    }
    
    createTable (type: schemaType): Promise<string>{
        return new Promise((resolve, reject)=> {
            if(type === schemaType.USER){
                logger.debug('Method: dropTable: Before dropping User table: query = ', CREATE_USER_TABLE);
                db.run(CREATE_USER_TABLE, (err, res) => {
                    if(err) reject("ERROR")
                    logger.debug('Method: dropTable: After dropping User table res = ', res);
                    resolve("SUCCESS")
                })
            }
        })
        
    }

    add(type: schemaType, obj: any): Promise<any>{
        return new Promise((resolve, reject)=> {
            if(type === schemaType.USER){
                logger.debug('Method: Add: schema type is USER')
                const fields: IUser = <IUser> obj;
                logger.debug('Method: Add: Before inserting the data');
                db.run(ADD_USER, [fields.fname, fields.lname, fields.phoneNumber, fields.username, 
                    fields.password ,fields.email, fields.publicKey, fields.privateKey, 
                    fields.hash, fields.birthdate, fields.jobTitle], (err, res) => {
                    if(err) reject(err)
                    this.getOne(schemaType.USER, { publicKey: fields.publicKey }).then((res: IUser)=> {
                        logger.debug('Method: Add: After inserting the data, newRecordId = ', res.id);
                        resolve(res)
                    })
                })
            }
        })
    }

    update(){

    }

    delete(type: schemaType, params):Promise<any>{
        return new Promise((resolve, reject) => {
            if(type === schemaType.USER){
                logger.debug('Method: delete: schema type is USER')
                const cols = Object.keys(params);
                let query = `DELETE FROM User WHERE `;
                cols.forEach((v, i)=> {
                    query = query + ' ' + v + ' = ? AND';
                })
                query = query.substring(0, query.lastIndexOf('AND'))
                logger.debug('Before delete the user query = ', query)
                const values = Object.keys(params).map(k => params[k])
                db.run(query, values, (err, row: IUser) => {
                    if (err) return reject(err)
                    return resolve(row);
                });
            }
        })
    }

    get(type: schemaType, clause: {}): Promise<Array<any>>{
        return new Promise((resolve, reject) => {
            if(type === schemaType.USER){
                logger.info('Method: Get: schema type is USER')
                logger.info('Method: Get: Before fetching rows');
                db.all(GET_USER, [], (err, rows: Array<IUser>) => {
                    if (err) {
                        return reject(err)
                    }
                    return resolve(rows);
                });
            }
        })
    }

    getOne(type: schemaType, params):Promise<any>{
        return new Promise((resolve, reject) => {
            if(type === schemaType.USER){
                logger.info('Method: Get: schema type is USER')
                const cols = Object.keys(params);
                let query = `${GET_USER} WHERE `;
                cols.forEach((v, i)=> {
                    query = query + ' ' + v + ' = ? AND';
                })
                query = query.substring(0, query.lastIndexOf('AND'))
                logger.info('Before fetching the user query = ', query)
                const values = Object.keys(params).map(k => params[k])
                db.get(query, values, (err, row: IUser) => {
                    if (err) return reject(err)
                    return resolve(row);
                });
            }
        })
    }

}