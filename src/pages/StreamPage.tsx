import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient, IRemoteAudioTrack, IRemoteVideoTrack, UID } from 'agora-rtc-sdk-ng';
import { IAgoraRTCRemoteUser, ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { fetchRTMToken, fetchToken } from '../services/authServices';
import { getResourceID, sendRecordingInfo, setUrl, startRecording, stopRecording } from '../services/recordingServices';
import mutedIcon from '../assets/muted.png'
import Header from '../components/Header';
import CommsButtons from '../components/CommsButtons';
import { useParams } from 'react-router-dom';
import { decodetoken } from '../services/miscServices';
import { getSessionInfo, getUser, pingSession, uploadChatMessage } from '../services/sessionServices';
import LiveChat from '../components/LiveChat';
import AgoraRTM from 'agora-rtm-sdk'

const appId = '51335c0cafd248d6b0e30d4a0f722e96';
const MINUTE_MS = 60000;
//const token = "00651335c0cafd248d6b0e30d4a0f722e96IADl2u1WImS8ngRHY2MpQmVYrwAWMy0V8A5wBIPBFwmUwKDfQtbSY0iIIgA4M+5Tl3hbZAQAAQCAUQEAAgCAUQEAAwCAUQEABACAUQEA";


interface IUser extends IAgoraRTCRemoteUser {
    username: string;
}

interface chatMessage {
    text: string;
    sender: string;
    timestamp: Date;
}


//call component with props
const Call: React.FC = () => {
    const { channelCode } = useParams();
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoOff, setIsVideoOff] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState<IUser[]>(new Array<IUser>());
    const [client, setClient] = useState<IAgoraRTCClient>();
    const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack>();
    const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack>();
    const [screenShareTrack, setScreenShareTrack] = useState<ILocalVideoTrack>();
    const [isJoined, setIsJoined] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [resourseId, setResourceId] = useState<string>();
    const [recorderUID, setrecorderUID] = useState("");
    const [recorderToken, setrecorderToken] = useState("");
    const [sid, setSID] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);
    const [channelInfo, setChannelInfo] = useState<any>({});
    const [user, setUser] = useState<any>({});
    const [role, setRole] = useState<string>('audience');
    const [isChatOpen, setChatIsOpen] = useState(true);
    const [chatClient, setChatClient] = useState<any>();
    const [chatChannel, setChatChannel] = useState<any>();
    const [chatMessages, setChatMessages] = useState<chatMessage[]>([]);
    const [count, setCount] = useState(0);




    const getChannelData = () => {
        getSessionInfo(channelCode).then((res) => {
            setChannelInfo(res)
            //get jwt token from local storage
            const token = localStorage.getItem('token');
            const user = decodetoken(token);
            console.log("__USER", user);
            setUser(user);
            if (res.lecturer?.id?.toString() == decodetoken(token)._id) {
                setRole('host');

            }
            else {
                setRole('audience');

            }
        }).catch(console.error
        )

    };
    useEffect(() => {
        if (localVideoTrack) {
            localVideoTrack.setEnabled(true);
            localVideoTrack.play(videoRef.current as HTMLVideoElement)
        }
    }, [localVideoTrack])

    const getUsername = (userId: string): Promise<string> => {
        return new Promise((resolve, reject) => {

            getUser(userId).then((res) => {
                console.log("Username:", res.username);
                resolve(res.username);
            }
            ).catch((err) => {
                console.log(err);
                reject(err);
            }
            );
        }
        )
    }

    const addMultipleToRemoteUsers = (users: IAgoraRTCRemoteUser[]) => {
        for (let user of users) {
            addToRemoteUsers(user);
        }
    }


    const addToRemoteUsers = (user: IAgoraRTCRemoteUser) => {
        if (remoteUsers.find((user2) => user2.uid == user.uid)) return;
        let _user = user as IUser;
        getUsername(_user.uid.toString()).then((res) => {
            console.log("____Username is", res, "for", _user.uid);

            _user.username = res;
            setRemoteUsers((prevRemoteUsers) => [...prevRemoteUsers, _user]);
        }
        ).catch((err) => {
            console.log(err);
        });

        if (user.hasAudio) {
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack?.play()
        }
        if (user.hasVideo) {
            console.log("___USER:", user, "_____",channelInfo)
            const remoteVideoTrack = user.videoTrack;
            if(user.uid == channelInfo.lecturer.id) {
                //set to videoref
                remoteVideoTrack?.play(videoRef.current as HTMLVideoElement);
            }
            else{
                remoteVideoTrack?.play(document.getElementById(`remote-video-${user.uid}`) as HTMLVideoElement);
            }
        }
        // setRemoteUsers((prevRemoteUsers) => [...prevRemoteUsers, user as IUser]);

    }

    useEffect(() => {
        if (isJoined) {
            for (let user of client.remoteUsers) {
                if (user.hasAudio) {
                    client.subscribe(user, 'audio').then(() => {
                        const remoteAudioTrack = user.audioTrack;
                        remoteAudioTrack?.play()

                    });
                }
                if (user.hasVideo) {
                    client.subscribe(user, 'video').then(() => {
                        const remoteVideoTrack = user.videoTrack;
                        console.log("___USER:", user, "_____",channelInfo)
                        if(user.uid == channelInfo.lecturer.id) {
                            //set to videoref
                            remoteVideoTrack?.play(videoRef.current as HTMLVideoElement);
                        }
                        else{
                            remoteVideoTrack?.play(document.getElementById(`remote-video-${user.uid}`) as HTMLVideoElement);
                        }

                    });
                }


            }
        }
    }, [remoteUsers])


    useEffect(() => {
        getChannelData();

        // get channel data
        

    }, []);

    useEffect(() => {
            const interval = setInterval(() => {
                pingSession(channelCode).then((res) => {
                    console.log('pinged',res);
                }
                ).catch((err) => {
                    console.log(err);
                }
                )
                setCount(prevCount => prevCount + 1);
            }, MINUTE_MS);
            return () => clearInterval(interval);
      }, [count]); 

    const sendChatMessage = (message: string) => {
        chatChannel.sendMessage({ text: message }).then(() => {
            console.log('Message sent successfully');
        }
        ).catch((err) => {
            console.log('Message failed to send', err);
        }
        )
        //add to chat messages
        let _chatMessage: chatMessage = {
            text: message,
            sender: user.username,
            timestamp: new Date()
        }
        uploadMessage(channelInfo.shareUrl, _chatMessage);
        setChatMessages((prevChatMessages) => [...prevChatMessages, _chatMessage]);
    }

    const sendSystemMessage = (message: string) => {
        let _chatMessage: chatMessage = {
            text: message,
            sender: "System",
            timestamp: new Date()
        }
        setChatMessages((prevChatMessages) => [...prevChatMessages, _chatMessage]);
    }

    const uploadMessage = (channelcode: string, message: chatMessage) => {
        uploadChatMessage(channelcode, message).then((res) => {
            console.log(res);
        }
        ).catch((err) => {
            console.log(err);
        }
        )

    }

    const joinRTC = async () => {
        if (isJoined) {
            if (isScreenSharing) {
                // Stop screen sharing
                screenShareTrack?.stop();
                screenShareTrack?.close();
                localVideoTrack?.close()
                localVideoTrack?.stop();
                setScreenShareTrack(undefined);
                // Enable camera video track

                localVideoTrack?.setEnabled(false);
                if (localVideoTrack) client?.unpublish([localVideoTrack])
                setLocalVideoTrack(undefined)
                setIsScreenSharing(false);
            }
            if (!isMuted) {
                localAudioTrack?.setMuted(true);
                setIsMuted(true);
                client?.unpublish(localAudioTrack)
                localAudioTrack?.close()
                setLocalAudioTrack(undefined);
            }
            if (isScreenSharing || !isVideoOff) {
                client?.unpublish([localVideoTrack])

                localVideoTrack.setEnabled(false);
                localVideoTrack.close();
                setIsVideoOff(true);
                setLocalVideoTrack(undefined)
            }



            return await client.leave();
        }
        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        const _chatClient = AgoraRTM.createInstance(appId);
        setClient(agoraClient);
        setChatClient(_chatClient);

        const token = await fetchToken(channelInfo.channelName, user._id);
        const chatToken = await fetchRTMToken(user._id);
        console.log("__TOKEN:", token)
        console.log("__CHAT_TOKEN:", chatToken)

        console.log("DEBUG", appId, channelInfo.channelName, token, `${user._id}`)
        agoraClient.join(appId, channelInfo.channelName, token, `${user._id}`).then((uid: number | string) => {
            setIsJoined(true);

            // setRemoteUsers((prevRemoteUsers) => [...prevRemoteUsers, ...agoraClient.remoteUsers as IUser[]]);
            addMultipleToRemoteUsers(agoraClient.remoteUsers)

        });

        _chatClient.login({ token: chatToken, uid: `${user._id}` }).then(() => {
            console.log('AgoraRTM client login success');
            let channel = _chatClient.createChannel(channelInfo.channelName);
            sendSystemMessage(`Successfully joined channel ${channelInfo.channelName}`)

            channel.on('ChannelMessage', ({ text }, senderId) => {
                console.log('Message from user ' + senderId + ': ' + text);
                console.log(remoteUsers)
                getUsername(senderId).then((res) => {
                    let _chatMessage: chatMessage = {
                        text: text,
                        sender: res,
                        timestamp: new Date()
                    }
                    setChatMessages((prevChatMessages) => [...prevChatMessages, _chatMessage]);
                }).catch((err) => {
                    console.log(err);
                });
            });
            channel.on('MemberJoined', (memberId) => {
                console.log(`${memberId} has joined!`);
                getUsername(memberId).then((res) => {
                    sendSystemMessage(`${res} has joined the channel!`);
                }).catch((err) => {
                    console.log(err);
                });
            });

            channel.on('MemberLeft', (memberId) => {
                console.log(`${memberId} has left!`);
                getUsername(memberId).then((res) => {
                    sendSystemMessage(`${res} has left the channel!`);
                }).catch((err) => {
                    console.log(err);
                });
            });



            channel.join().then(() => {
                console.log('AgoraRTM client channel join success');
                setChatChannel(channel);
            }).catch((err: any) => {
                console.log('AgoraRTM client channel join failure', err);
            });
        }).catch((err: any) => {
            console.log('AgoraRTM client login failure', err);
        });




        // Subscribe to remote users
        agoraClient.on('user-published', async (user, mediaType) => {

            await agoraClient.subscribe(user, mediaType);
            console.log("__DEBUG:", user);
            if (user.hasAudio) {
                agoraClient.subscribe(user, 'audio').then(() => {
                    const remoteAudioTrack = user.audioTrack;

                    remoteAudioTrack?.play()

                });
            }
            if (user.hasVideo) {

                agoraClient.subscribe(user, 'video').then(() => {
                    const remoteVideoTrack = user.videoTrack;
                    console.log("___USER:", user, "_____",channelInfo)
                    if(user.uid == channelInfo.lecturer.id) {
                        //set to videoref
                        remoteVideoTrack?.play(videoRef.current as HTMLVideoElement);
                    }
                    else{
                        remoteVideoTrack?.play(document.getElementById(`remote-video-${user.uid}`) as HTMLVideoElement);
                    }
                    
                });
            }
            // setRemoteUsers((prevRemoteUsers) => [...prevRemoteUsers, user as IUser]);
            // if (mediaType === 'video') {
            //     const remoteVideoTrack = user.videoTrack;
            // setRemoteUsers((prevRemoteUsers) => new Set([...prevRemoteUsers, user]));
            //     remoteVideoTrack?.play(document.getElementById(`remote-video-${user.uid}`) as HTMLVideoElement);
            // }
            // if (mediaType === 'audio') {
            //     const remoteAudioTrack = user.audioTrack;
            //     setRemoteUsers((prevRemoteUsers) => new Set([...prevRemoteUsers, user]));
            //     remoteAudioTrack?.play()
            // }
        });

        agoraClient.on('user-unpublished', (_user, mediaType) => {
            if (mediaType === 'video') {
                const remoteVideoTrack = _user.videoTrack;
                remoteVideoTrack?.stop();
            }
        });

        agoraClient.on('published-user-list', (users) => {
            console.log("____USERRRR", users);

        });


        agoraClient.on('user-left', (user) => {
            setRemoteUsers((prevRemoteUsers) => {
                let newRemoteUsers = prevRemoteUsers;
                newRemoteUsers = newRemoteUsers.filter((user2) => user2.uid !== user.uid);
                return newRemoteUsers;
            });
        });

        agoraClient.on("user-joined", (_user: IAgoraRTCRemoteUser) => {
            addToRemoteUsers(_user);
            // setRemoteUsers((prevRemoteUsers) => [...prevRemoteUsers, _user as IUser]);
            // if (user.hasAudio) {
            //     const remoteVideoTrack = user.videoTrack;

            //     remoteVideoTrack?.play(document.getElementById(`remote-video-${user.uid}`) as HTMLVideoElement);
            // }
            // if (user.hasAudio) {
            //     const remoteAudioTrack = user.audioTrack;
            //     setRemoteUsers((prevRemoteUsers) => new Set([...prevRemoteUsers, user]));
            //     remoteAudioTrack?.play()
            // }
        })
        console.log("REMOTE:", agoraClient.remoteUsers)
        // return () => {
        //     // Leave the channel and clean up resources
        //     agoraClient.leave();
        //     localAudioTrack?.stop();
        //     localAudioTrack?.close();
        //     localVideoTrack?.stop();
        //     localVideoTrack?.close();
        //     screenShareTrack?.stop();
        //     screenShareTrack?.close();
        // };
    }

    const toggleMute = () => {
        if (isMuted) {
            AgoraRTC.createMicrophoneAudioTrack().then((microphoneTrack) =>
                client?.publish([microphoneTrack]).then(() => {
                    setLocalAudioTrack(microphoneTrack)
                    setIsMuted(false);
                    microphoneTrack.setMuted(false);
                })
            )
            return
        } else {
            localAudioTrack?.setMuted(true);
            setIsMuted(true);
            client?.unpublish(localAudioTrack)
            localAudioTrack?.close()
            setLocalAudioTrack(undefined);
        }



    };

    const toggleVideo = () => {

        if (isVideoOff) {
            //if screensharing close screenshare
            if (isScreenSharing) {
                // Stop screen sharing
                toggleScreenShare();
            }
            AgoraRTC.createCameraVideoTrack().then((cameraTrack) =>
                client?.publish([cameraTrack]).then(() => {
                    setLocalVideoTrack(cameraTrack)
                    setIsVideoOff(false);
                    cameraTrack.play(videoRef.current as HTMLVideoElement);
                    cameraTrack.setEnabled(true);
                }).catch((err) => {
                    console.log("Error CAMERA", err);
                })
                
            )
            return
        } else {
            client?.unpublish([localVideoTrack])
            localVideoTrack.setEnabled(false);
            localVideoTrack.close();
            setIsVideoOff(true);
            setLocalVideoTrack(undefined)
        }
    };

    const toggleScreenShare = async () => {

        if (isScreenSharing) {
            // Stop screen sharing
            setIsScreenSharing(false);
            screenShareTrack?.stop();
            screenShareTrack?.close();
            //unpublish 
            client?.unpublish([screenShareTrack])
            setScreenShareTrack(undefined);


        } else {
            if (!isVideoOff) {
                toggleVideo();
            }
            setIsScreenSharing(true);
            const config = { width: 1280, height: 720, frameRate: 30 };
            // Get screen sharing track
            const screenTrack = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: config,
                }, "disable").then((screenTrack) => {
                    // Play the local video track

                    // Publish the local video track
                    client?.publish([screenTrack]).then(() => {
                        setScreenShareTrack(screenTrack);
                        screenTrack.play(videoRef.current as HTMLVideoElement);
                        screenTrack.setEnabled(true);
                        
                    });
                }
                ).catch((err) => {
                    console.log(err);
                }
                )

        }
    };

    const handleRecording = async () => {
        if (!isRecording) {
            //get resource id

            const users = client.remoteUsers;
            console.log("____users", users);
            console.log("____R.users", remoteUsers);
            const _recorderUID = Math.floor(Math.random() * 99999);
            const rid = await getResourceID(channelInfo.channelName, _recorderUID);
            setResourceId(rid)
            //set ^




            //get attandeeList
            const _recorderToken = await fetchToken(channelInfo.channelName, _recorderUID);

            setrecorderToken(recorderToken);
            setrecorderUID(`${_recorderUID}`);

            // client.remoteUsers.forEach((user) => {
            //     console.log("____", user);
            
            // })
            // const a = ( as unknown as any);
            // console.log("____", a._uintid);
            
            const response = await startRecording(channelInfo.channelName, `${_recorderUID}`, rid, `${0}`, _recorderToken);
            if (response) {
                setIsRecording(true);
                setSID(response.sid);
                console.log("___", response);
                sendRecordingInfo(channelInfo.channelName,`${_recorderUID}`,response.resourceId, response.sid );
                sendChatMessage(`Recording started`)
            }

            
            //start recording
            //set recordingid
        }
        else {
            //get recordingid
            const response = await stopRecording(channelInfo.channelName, recorderUID, resourseId, sid);
            // response.serverResponse?.fileList
            if (response) {
                setIsRecording(false);
                console.log("___", response);
                setUrl(channelInfo.channelName,sid,response.serverResponse?.fileList);
                sendChatMessage(`Recording uploaded, file: ${response.serverResponse?.fileList}`)
            }
            
            //stoprecording
            //verifyupload
            //return vod url
        }
    }

    const renderRemoteUsers = () => {
        return (
            <div className="w3-container w3-row" >
                {Array.from(remoteUsers).map((_user) => (
                    <div key={`${_user.uid}`} className='w3-col m4 l2 s6 w3-card w3-margin-right w3-margin-bottom'>
                        <div id={`player-${_user.uid}`} key={_user.uid} className=" w3-display-container w3-hover-text w3-dark-grey " style={{ width: "100%", aspectRatio: 4 / 3 }}>

                            <div className="w3-display-bottomleft w3-container ">
                                <span className="hidden-text w3-text-white">{`${_user.username} ${_user.uid}`}</span>
                            </div>
                            <div className="w3-display-topright w3-container ">
                                {(!(_user.hasAudio && _user.audioTrack.isPlaying)) ? <img className='w3-margin-top w3-right' src={mutedIcon} alt="muted" style={{ width: "60%", height: "60%" }} /> : <></>}
                            </div>
                            {/* {(user.hasAudio && user.audioTrack.isPlaying) ? <div className="w3-cell-bottom w3-right w3-container "><span className="w3-text-white">MIC</span></div>:<></>} */}
                            {(true) ?
                                <video id={`remote-video-${_user.uid}`} autoPlay playsInline style={{ width: "100%" }} /> :
                                <div className='w3-display-middle center-div'>
                                    <img src="https://www.w3schools.com/w3images/avatar2.png" alt="Avatar" style={{ verticalAlign: 'middle', width: '25%', height: '25%', borderRadius: '50%' }} />
                                </div>
                            }


                        </div>
                    </div>
                ))}
            </div>
        );
    };
    //what is the width and height of 360p:
    return (
        <><Header></Header>
            <LiveChat
                isOpen={isChatOpen}
                setIsOpen={setChatIsOpen}
                chatMessages={chatMessages}
                sendChatMessage={sendChatMessage}
            />
            {(true)?<div className="w3-container w3-padding-small w3-round w3-card w3-grey w3-margin-bottom">
                <video ref={videoRef} className="w3-margin" style={{ maxHeight: '720px' }} autoPlay playsInline />

            </div>:<> </>}
            {renderRemoteUsers()}
            

            <CommsButtons
                toggleMute={toggleMute}
                isMuted={isMuted}
                toggleVideo={toggleVideo}
                isVideoOff={isVideoOff}
                toggleScreenShare={toggleScreenShare}
                isScreenSharing={isScreenSharing}
                joinRTC={joinRTC}
                isJoined={isJoined}
                handleRecording={handleRecording}
                isRecording={isRecording}
                toggleChat={() => setChatIsOpen(!isChatOpen)}
                isLecturer={role}
            ></CommsButtons>

        </>
    );
};

export default Call;
