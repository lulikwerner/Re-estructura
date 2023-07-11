import mongoose from "mongoose";
import dotenv from 'dotenv';

//Define que Dao tomar a partir de persistence
const persistence = 'MONGO';


export default class PersistenceFactory {
    static async getPersistence(){
        let cartsDAO;
        switch(persistence){
            case 'FILESYSTEM': 
                const {default: FileSystemDAO} = await import ('./fileSystem/Managers/cartManager/js')
                cartsDAO = new MemoryDAO();
                break;
            case 'MONGO':
                mongoose.connect(process.env.MONGO_URL);
                const {default: MongoDAO} = await import ('./mongo/managers/cartManager.js')
                cartsDAO = new MongoDAO();
                break;
        }
        return cartsDAO;
    }
}
