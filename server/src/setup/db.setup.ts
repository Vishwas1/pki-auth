import { schemaType, DBService } from '../services/db.service';
import { logger } from '../config'

export default function setupDb(){
    let dbService: DBService;
    dbService = new DBService();
    logger.info('DB SETUP SERVICE:: Dropping User table.....')
    dbService.dropTable(schemaType.USER).then((res) => {
        logger.info('DB SETUP SERVICE:: User table dropped.')
        logger.info('DB SETUP SERVICE:: Creating User table....')
        return dbService.createTable(schemaType.USER) 
    }).then((res) => {
        logger.info('DB SETUP SERVICE:: User table created.')
    }).catch((e) => {
        logger.info('DB SETUP SERVICE:: Error = ', JSON.stringify(e))
    })
}

