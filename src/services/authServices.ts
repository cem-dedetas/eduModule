const BASEURL = 'http://localhost:5172';

const fetchToken = async (channelName:string, uid:number) => {
    const response = await fetch(`${BASEURL}/token/generate/${channelName}/${uid}`,{
        method:'GET'
    });
    const data = await response.json();
    return data;
}

export {fetchToken};