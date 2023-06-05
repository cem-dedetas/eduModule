const BASEURL = 'http://localhost:5172';

const getResourceID = async (channelName:string, uid:number) => {
    const response = await fetch(`${BASEURL}/record/getResourceID/${channelName}/${uid}`,{
        method:'GET'
    });
    const data = JSON.parse(await response.json());
    // console.log(data.resourceId)
    return data.resourceId;
}

const startRecording = async (channelName:string, uid:string,resourceId:string,participants:string[],token:string) => {
    const response = await fetch(`${BASEURL}/record/start/${channelName}/${uid}`,{
        method:'POST',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin':'*'
        },
        mode:'cors',
        body:JSON.stringify({
            rid:resourceId,
            participants:participants,
            ctype:1,
            token:token
        })
    });
    const data = JSON.parse( await response.json());
    // console.log(data.resourceId)
    return data;
}

const stopRecording = async (channelName:string, uid:string,resourceId:string,sid:string) => {
    const response = await fetch(`${BASEURL}/record/stop/${channelName}/${uid}/${resourceId}/${sid}`,{
        method:'POST',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin':'*'
        },
        mode:'cors',
    });
    const data = JSON.parse( await response.json());
    // console.log(data.resourceId)
    return data;
}

export {getResourceID, startRecording, stopRecording};