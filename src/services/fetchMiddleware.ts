const BASEURL = 'http://3.82.92.7';


const sendRequest = async (url:string, method:string, body?:any) => {
    //get token from local storage
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASEURL}${url}`,{
        method,
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:(body)?JSON.stringify(body):null
    });
    const data = await response.json();
    return data;
}

export {sendRequest};