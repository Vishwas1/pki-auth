import { schemaType, DBService } from '../services/db.service';
import { logger } from '../config'

export default function setupDb(){
    let dbService: DBService;
    dbService = new DBService();
    logger.debug('DB SETUP SERVICE:: Dropping User table.....')
    dbService.dropTable(schemaType.USER).then((res) => {
        logger.debug('DB SETUP SERVICE:: User table dropped.')
        logger.debug('DB SETUP SERVICE:: Creating User table....')
        return dbService.createTable(schemaType.USER) 
    }).then((res) => {
        logger.debug('DB SETUP SERVICE:: User table created.')
    }).catch((e) => {
        logger.error(e)
        logger.debug('DB SETUP SERVICE:: Error = ', JSON.stringify(e))
    })
}

