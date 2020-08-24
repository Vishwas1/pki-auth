import { SchemaType, DBService } from '../services/db.service';
import { logger } from '../config'

let dbService: DBService;
dbService = new DBService();

async function dropTable(type: SchemaType){
    try{
        await dbService.dropTable(type)
    }catch(e){
        logger.error(e)
    }
}

async function createTable(type: SchemaType){
    await dbService.createTable(type) 
}

export default  async function setupDb(){
    try{
        await dropTable(SchemaType.User)
        await dropTable(SchemaType.Application)
        await dropTable(SchemaType.VerifiableCredential)
        
        await createTable(SchemaType.User) 
        await createTable(SchemaType.Application) 
        await createTable(SchemaType.VerifiableCredential) 
    }
    
    catch(e){
        logger.error(e)
    }
}

