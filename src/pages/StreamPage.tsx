import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient, IRemoteAudioTrack, IRemoteVideoTrack, UID } from 'agora-rtc-sdk-ng';
import { IAgoraRTCRemoteUser, ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { fetchToken } from '../services/authServices';
import { getResourceID, startRecording, stopRecording } from '../services/recordingServices';
import  mutedIcon  from '../assets/muted.png'
import Header from '../components/Header';

const appId = '51335c0cafd248d6b0e30d4a0f722e96';
//const token = "00651335c0cafd248d6b0e30d4a0f722e96IADl2u1WImS8ngRHY2MpQmVYrwAWMy0V8A5wBIPBFwmUwKDfQtbSY0iIIgA4M+5Tl3hbZAQAAQCAUQEAAgCAUQEAAwCAUQEABACAUQEA";
const channel = 'test3';


const Call = () => {
    const [localUID, setLocalUID] = useState<number>(Math.floor(Math.random() * 99999));
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoOff, setIsVideoOff] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState<Set<IAgoraRTCRemoteUser>>(new Set<IAgoraRTCRemoteUser>());
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



    useEffect(() => {
        if (localVideoTrack) {
            localVideoTrack.setEnabled(true);
            localVideoTrack.play(videoRef.current as HTMLVideoElement)
        }
    }, [localVideoTrack])


    useEffect(() => {
        if (isJoined) {
            for (let user of client.remoteUsers) {
                if (user.hasAudio) {
                    client.subscribe(user, 'audio').then(() => {
                        const remoteAudioTrack = user.audioTrack;
                        setRemoteUsers((prevRemoteUsers) => new Set([...prevRemoteUsers, user]));
                        remoteAudioTrack?.play()

                    });
                }
                if (user.hasVideo) {
                    client.subscribe(user, 'video').then(() => {
                        const remoteVideoTrack = user.videoTrack;
                        setRemoteUsers((prevRemoteUsers) => new Set([...prevRemoteUsers, user]));
                        remoteVideoTrack?.play(document.getElementById(`remote-video-${user.uid}`) as HTMLVideoElement);

                    });
                }


            }
        }
    }, [remoteUsers])
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
        setClient(agoraClient);


        const token = await fetchToken(channel, localUID);
        console.log("__TOKEN:", token)

        agoraClient.join(appId, channel, token, `${localUID}`).then((uid: number | string) => {
            setIsJoined(true);
            setRemoteUsers((prevRemoteUsers) => new Set([...prevRemoteUsers, ...agoraClient.remoteUsers]));

        });
        // Join the channel


        // Subscribe to remote users
        agoraClient.on('user-published', async (user, mediaType) => {
            // console.log("DEBUG:", user);
            await agoraClient.subscribe(user, mediaType);
            setRemoteUsers((prevRemoteUsers) => new Set([...prevRemoteUsers, user]));
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

        agoraClient.on('user-unpublished', (user, mediaType) => {
            if (mediaType === 'video') {
                const remoteVideoTrack = user.videoTrack;
                remoteVideoTrack?.stop();
            }
        });
        agoraClient.on('user-left', (user) => {
            setRemoteUsers((prevRemoteUsers) => {
                prevRemoteUsers.delete(user);
                return new Set([...prevRemoteUsers]);
            });
        });
        
        agoraClient.on("user-joined", (user: IAgoraRTCRemoteUser) => {
            setRemoteUsers((prevRemoteUsers) => new Set([...prevRemoteUsers, user]));
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
        console.log(agoraClient.remoteUsers)
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
        if (localVideoTrack) {
            setIsScreenSharing(false);
            if (isVideoOff && !isScreenSharing) {
                AgoraRTC.createCameraVideoTrack().then((videoTrack) => {
                    client?.publish([videoTrack]).then(() => {
                        setLocalVideoTrack(videoTrack);
                        localVideoTrack.setEnabled(true);
                        setIsVideoOff(false);
                    });
                }).catch(err => alert(err));
            } else if (!isScreenSharing && !isVideoOff) {
                client?.unpublish([localVideoTrack])

                localVideoTrack.setEnabled(false);
                localVideoTrack.close();
                setIsVideoOff(true);
                setLocalVideoTrack(undefined)
            }
            else {
                client?.unpublish([localVideoTrack])
                localVideoTrack.close();
                localVideoTrack.stop();
                setLocalVideoTrack(undefined);
                AgoraRTC.createCameraVideoTrack().then((videoTrack) => {
                    client?.publish([videoTrack]).then(() => {
                        setLocalVideoTrack(videoTrack);
                    });
                });

            }
        }
        else {
            AgoraRTC.createCameraVideoTrack().then((videoTrack) => {
                client?.publish([videoTrack]).then(() => {
                    setLocalVideoTrack(videoTrack);
                    setIsVideoOff(false);
                });
            }).catch(err => alert(err));
        }
    };

    const toggleScreenShare = async () => {
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
        } else {
            try {

                const config = {
                    encoderConfig: { width: 1280, height: 720, frameRate: 10 },
                };

                AgoraRTC.createScreenVideoTrack(config, "disable").then((screenShareTrack) => {
                    //replace camera track with screen track if camera track is enabled
                    if (!isVideoOff) {
                        client?.unpublish([localVideoTrack])
                        localVideoTrack.setEnabled(false);
                        localVideoTrack.close();
                        setIsVideoOff(true);
                        setLocalVideoTrack(undefined)
                    }
                    client?.publish([screenShareTrack]).then(() => {
                        setScreenShareTrack(screenShareTrack);
                        screenShareTrack.play(videoRef.current as HTMLVideoElement);
                        setIsScreenSharing(true);
                    }
                    );

                    
                });


            } catch (error) {
                console.error('Failed to start screen sharing', error);
            }
        }
    };

    const handleRecording = async () => {
        if (!isRecording) {
            //get resource id
            const _recorderUID = Math.floor(Math.random() * 99999);
            const rid = await getResourceID(channel, _recorderUID);
            setResourceId(rid)
            //set ^

            const users = client.remoteUsers;
            let userIDs: Set<string> = new Set<string>();
            userIDs.add(`${localUID}`);
            for (let userdetails of users) {
                if (userdetails.hasVideo || userdetails.hasAudio) {
                    userIDs.add(`${userdetails.uid}`);
                }
            }

            //get attandeeList
            const array = Array.from(userIDs);
            const _recorderToken = await fetchToken(channel, _recorderUID);

            setrecorderToken(recorderToken);
            setrecorderUID(`${_recorderUID}`);

            const response = await startRecording(channel, `${_recorderUID}`, rid, array, _recorderToken);
            if (response) {
                setIsRecording(true);
                setSID(response.sid);
                console.log("___", response);
            }

            //start recording
            //set recordingid
        }
        else {
            //get recordingid
            const response = await stopRecording(channel, recorderUID, resourseId, sid);
            console.log("___STOP__", response)
            //stoprecording
            //verifyupload
            //return vod url
        }
    }

    const renderRemoteUsers = () => {
        return (
            <div className="w3-row">
                {Array.from(remoteUsers).map((user) => (
                        <div className='w3-card w3-quarter w3-margin-right w3-margin-bottom'>
                        <div id={`player-${user.uid}`} key={user.uid} className=" w3-display-container w3-hover-text w3-dark-grey " style={{width:"100%", aspectRatio:4/3}}>
                        
                            <div className="w3-display-bottomleft w3-container ">
                                <span className="hidden-text w3-text-white">{`User${user.uid} ${(user.hasAudio && user.audioTrack.isPlaying)}`}</span>
                            </div>
                            <div className="w3-display-topright w3-container ">
                                {(!(user.hasAudio && user.audioTrack.isPlaying)) ? <img className='w3-margin-top w3-right' src={mutedIcon} alt="muted" style={{width:"50%", height:"50%"}}/>:<></>}
                            </div>
                            {/* {(user.hasAudio && user.audioTrack.isPlaying) ? <div className="w3-cell-bottom w3-right w3-container "><span className="w3-text-white">MIC</span></div>:<></>} */}
                            {(user.hasVideo) ? 
                                    <video id={`remote-video-${user.uid}`} autoPlay playsInline style={{width:"100%"}}/> : 
                                    <div className='w3-display-middle center-div'>
                                        <img src="https://www.w3schools.com/w3images/avatar2.png" alt="Avatar" style={{ verticalAlign:'middle',width:'25%', height:'25%',borderRadius:'50%' }} />
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
        <div className="w3-container">
            <Header></Header>
            <div className="w3-row">
            <div className="w3-col s12 m8 l9">
                    <video ref={videoRef} className="w3-margin-bottom" style={{ maxHeight: '360px', maxWidth: '640px' }} autoPlay playsInline />
    
                </div>
                <div className="w3-col s12 m4 l3">
                    <button className="w3-button w3-block w3-border w3-margin-bottom" onClick={toggleMute}>
                        {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                    <button className="w3-button w3-block w3-border w3-margin-bottom" onClick={toggleVideo}>
                        {isVideoOff ? 'Start Video' : 'Stop Video'}
                    </button>
                    <button className="w3-button w3-border w3-border w3-block w3-margin-bottom" onClick={toggleScreenShare}>
                        {isScreenSharing ? 'Stop Screen Share' : 'Start Screen Share'}
                    </button>
                    <button className="w3-button w3-border w3-block w3-margin-bottom" onClick={joinRTC}>
                        {isJoined ? 'Leave' : 'Join'}
                    </button>
                    <button className="w3-button w3-border w3-block w3-margin-bottom" onClick={handleRecording}>
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                </div>
            </div>
                    {renderRemoteUsers()}
        </div>
    );
};

export default Call;
