import jwt_decode from 'jwt-decode';
import { sendRequest } from './fetchMiddleware';
const BASE_URL = 'http://localhost:5172';



const getTags = async () => {
    return sendRequest('/tags','GET');
}

const decodetoken = (token:string):any => {
    const decoded = jwt_decode(token);
    return decoded;
}


export {getTags, decodetoken};

