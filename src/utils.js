import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const cookieExtractor = (req) => {
  let token = null;
  console.log('entro en extractor');
  
  
  if (req && req.cookies) {
    console.log('entro aca');
    token = req.cookies['authToken'];
  }
  
  // Handle socket.io connection
  if (!token && req && req.headers && req.headers.cookie) {
    console.log('Extraemos con el extractor');
    const cookie = req.headers.cookie;
    const cookieRegex = /authToken=([^;]+)/;  // Update the cookieRegex to match 'authToken'
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
