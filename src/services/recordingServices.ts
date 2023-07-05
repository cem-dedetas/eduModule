import { sendRequest } from "./fetchMiddleware";

const BASEURL = 'http://3.82.92.7';

const getResourceID = async (channelName:string, uid:number) => {
    const response = await fetch(`${BASEURL}/record/getResourceID/${channelName}/${uid}`,{
        method:'GET'
    });
    const data = JSON.parse(await response.json());
    // console.log(data.resourceId)
    return data.resourceId;
}

const startRecording = async (channelName:string, uid:string,resourceId:string,focuseduser:string,token:string) => {
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
            uid:focuseduser,
            ctype:1,
            token:token
        })
    });
    const data = JSON.parse( await response.json());
    // console.log(data.resourceId)

    const response2 = await fetch(`${BASEURL}/liveLecture/createRecording/${channelName}/${data.sid}/${data.uid}/${resourceId}`,{
        method:'POST',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin':'*'
        },

    });
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

const sendRecordingInfo = async (channelName:string, uid:string,resourceId:string,sid:string) => {
    return await sendRequest(`/liveLecture/createRecording/${channelName}/${sid}/${uid}/${resourceId}`,'POST',{
        
    });
}

const setUrl = async (channelName:string,sid:string, url:string) => {
    return await sendRequest(`/liveLecture/endRecording/${sid}`,'POST',{
        url:url
    }
    );
}

const getLectureInfo = async () => {
    return await sendRequest(`/liveLecture/getAll`,'GET'
    );
}



export {getResourceID, startRecording, stopRecording,sendRecordingInfo, setUrl, getLectureInfo};