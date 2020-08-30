import { DBService, SchemaType } from '../services/db.service';

const info = async (req, res) => {
    try{
        const info = {
            status: "LIVE",
            nodeUrl: "http://localhost:5000",
            explorerUrl: "http://localhost:5001",
            schemaCount: 0,
            didCount: 0,
            transactions: 0
        }
        const db = new DBService();
        info.didCount = (await db.getAll(SchemaType.Did, {})).length;
        info.schemaCount = (await db.getAll(SchemaType.Schema, {})).length;
        res.status(200).send(info)
    }catch(e){
        res.status(500).send({ status: 500, message: null, error: e.message})
    }
}

export default info