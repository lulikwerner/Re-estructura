import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const cookieExtractor = (req) => {
  let token = null;
  console.log('entro en extractor');
  
  
  if (req && req.cookies) {
    token = req.cookies['authToken'];
  }
  
  // Maneja socket.io connection
  if (!token && req && req.headers && req.headers.cookie) {
    console.log('Extraemos con el header');
    const cookie = req.headers.cookie;
    const cookieRegex = /authToken=([^;]+)/;  
    const match = cookie.match(cookieRegex);
    if (match) {
      token = match[1];
      console.log('Token from headers:', token);
    }
  }
  
  return token;
};



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { __dirname };
