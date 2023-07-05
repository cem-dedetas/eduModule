import { sendRequest } from "./fetchMiddleware";


interface chatMessage {
    text: string;
    sender: string;
    timestamp: Date;
}
    

const createSession = async (channelName:string) => {
    return await sendRequest(`/liveLecture/create/${channelName}`,'GET');
}

const joinSession = async (channelCode:string) => {
    return await sendRequest(`/liveLecture/${channelCode}/userJoin`,'POST',{});
}


const pingSession = async (channelCode:string) => {
    return await sendRequest(`/liveLecture/${channelCode}/userPing`,'POST',{});
}

const getSessionInfo = async (channelCode:string) => {
    return await sendRequest(`/liveLecture/get/${channelCode}`,'GET');

}

const getUser = async (userId:string) => {
    return await sendRequest(`/users/${userId}`,'GET');
}

const uploadChatMessage = async (channelCode:string, message:chatMessage) => {
    return await sendRequest(`/liveLecture/${channelCode}/chat/addMessage`,'POST',message);
}
export {createSession, getSessionInfo, joinSession, pingSession, getUser, uploadChatMessage};