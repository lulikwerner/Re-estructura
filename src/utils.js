import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const cookieExtractor = (req) => {
    //Suponemos que no tenemos ningun token
    let token = null;
    //Vamos a validar que en el request si  hay una cookie quiero extrar la que se llama authToken
    if(req&&req.cookie){
        token = req.cookies['authToken'];
    }
    return token;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { __dirname };
