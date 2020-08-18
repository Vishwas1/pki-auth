// import { schemaType, DBService } from '../services/db.service';
// import { logger } from '../config'

// export default function setupDb(){
//     let dbService: DBService;
//     dbService = new DBService();
//     logger.debug('DB SETUP SERVICE:: Dropping User table.....')
//     dbService.dropTable(schemaType.USER).then((res) => {
//         logger.debug('DB SETUP SERVICE:: User table dropped.')
//         logger.debug('DB SETUP SERVICE:: Creating User table....')
//         return dbService.createTable(schemaType.USER) 
//     }).then((res) => {
//         logger.debug('DB SETUP SERVICE:: User table created.')
//     }).catch((e) => {
//         logger.error(e)
//         logger.debug('DB SETUP SERVICE:: Error = ', JSON.stringify(e))
//     })
// }


import { schemaType, DBService } from '../services/db.service';
import { logger } from '../config'

let dbService: DBService;
dbService = new DBService();

async function dropTable(type: schemaType){
    try{
        await dbService.dropTable(type)
    }catch(e){
        logger.error(e)
    }
}

async function createTable(type: schemaType){
    await dbService.createTable(type) 
}

export default  async function setupDb(){
    try{
        await dropTable(schemaType.USER)
        await createTable(schemaType.USER) 
    }
    catch(e){
        logger.error(e)
    }
}

