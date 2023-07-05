import { sendRequest } from "./fetchMiddleware";

const BASEURL = 'http://3.82.92.7';



//copy above function with sendRequest

const fetchToken = async (channelName:string, uid:number) => {
    return await sendRequest(`/token/generate/${channelName}/${uid}`,'GET');
}

const fetchRTMToken = async (uid:number) => {
    return await sendRequest(`/token/generateRTM/${uid}`,'GET');
}


const signUp = async (email:string, password:string,idNumber:string, username:string) => {
    const response = await fetch(`${BASEURL}/auth/signup`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            email:email,
            password:password,
            id_number:idNumber,
            username:username
        })
    });
    const data = await response.json();
    return data;
}

const signIn = async (email:string, password:string) => {
    const response = await fetch(`${BASEURL}/auth/signin`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            email,
            password
        })
    });
    const token = await response.json();
    localStorage.setItem('token',token);
    return token;
}






export {fetchToken, signUp, signIn, fetchRTMToken};