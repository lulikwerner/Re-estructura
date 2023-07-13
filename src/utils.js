import { fileURLToPath } from 'url';
import { dirname } from 'path';


export const cookieExtractor = (req) => {
  let token = null;
  
  // Handle regular HTTP request
  if (req && req.cookies) {
    token = req.cookies['authToken'];
  }
  
  // Handle socket.io connection
  if (!token && req && req.headers && req.headers.cookie) {
    const cookie = req.headers.cookie;
    const cookieRegex = /auth=([^;]+)/;
    const match = cookie.match(cookieRegex);
    if (match) {
      token = match[1];
    }
  }
  
  return token;
};



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { __dirname };
