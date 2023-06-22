//react boilerplate
//

// Path: src/pages/JoinPage.tsx

import React, {useState, useEffect} from 'react'
import Header from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../components/TagDropdown';
import AgoraRTC, { ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { getSessionInfo, joinSession } from '../services/sessionServices';
import { decodetoken, getTags } from '../services/miscServices';

const Prejoin:React.FC = () => {

  const {channelCode} = useParams();
  const navigate = useNavigate();

  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [tags, setTags] = useState<any>([]);
  const [possibleTags, setPossibleTags] = useState<any>([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [channelInfo, setChannelInfo] = useState<any>({});
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack|undefined>();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [user , setUser] = useState<any>({});
  const [role, setRole] = useState<string>('audience');

  const getPossibleTags = () => {
    getTags().then((res)=>{
      setPossibleTags(res);
    }
    ).catch(console.error
    )

  };



  const getChannelData = () => {
    getSessionInfo(channelCode).then((res)=>{
      setChannelInfo(res)
      //get jwt token from local storage
      const token = localStorage.getItem('token');
      setUser(decodetoken(token));
      if(res.lecturer?.id?.toString() == decodetoken(token)._id){
        setRole('host');
        
      }
      else{
        setRole('audience');

      }
      if(res.tags){
        setTags(res.tags);
      }
    }
    ).catch(console.error
    )
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  useEffect(() => {
    if (localVideoTrack) {
        localVideoTrack.play(videoRef.current as HTMLVideoElement)
    }
}, [localVideoTrack])

  useEffect(() => {
    getPossibleTags();
    getChannelData();
    
  }, []);

  const handleToggleCamera = () => {
    if(!cameraOn){
    AgoraRTC.createCameraVideoTrack().then((videoTrack) => {
            
            setLocalVideoTrack(videoTrack);
            setCameraOn(!cameraOn);
    }).catch(err => alert(err));
    }else{
        localVideoTrack.stop();
        localVideoTrack.close();
        setLocalVideoTrack(undefined);
        setCameraOn(!cameraOn);
    }

    
  };

  const handleAddTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
    }
    setSelectedTag('');
  };

  const handleRemoveTag = (tag: number) => {
    setTags(tags.filter((t) => t.id !== tag));
  };

  const handleJoinCall = () => {
    //update tags
    
    //send join ping to server
    joinSession(channelCode).then((res)=>{
      console.log(res);
      navigate(`/stream/${channelCode}`);
    }
    ).catch((err)=>{
      console.log(err);
    }
    )
  };

  const handleBack = () => {
    navigate('/join');
  };


  return (
    <div className="w3-container">
      <div className="w3-card">
        <h2 className="w3-container">Room: {channelInfo.channelName ?? ''}</h2>
        <h3 className="w3-container">Lecturer: {channelInfo.lecturer?.username ?? ''}</h3>
        <h4 className="w3-container">
          You are joining as {role === 'host' ? 'the host.' : `: "${user.username}" `}
        </h4>
        <p> Share this code for people to join : {channelInfo.shareUrl}</p>
  
        <div className="w3-container w3-center">
          <div className="w3-block">
            <button className="w3-button w3-green w3-round w3-margin" onClick={handleJoinCall}>
              Join Call
            </button>
            <button className="w3-button w3-blue w3-round w3-margin" onClick={handleBack}>
              Go Back
            </button>
  
            <button
              className={`w3-button w3-${muted ? 'red' : 'green'} w3-round w3-margin`}
              onClick={handleToggleMute}
            >
              {muted ? 'Unmute Mic' : 'Mute Mic'}
              <img></img>
            </button>
            <button
              className={`w3-button w3-${cameraOn ? 'red' : 'green'} w3-round w3-margin`}
              onClick={handleToggleCamera}
            >
              {cameraOn ? 'Turn Camera Off' : 'Test Your Camera'}
            </button>
          </div>
  
          {localVideoTrack && (
            <div className="w3-container w3-card w3-padding w3-margin w3-round-large w3-dark-grey" style={{display:'inline-flex'}}>

              <video ref={videoRef} className="" style={{ width: '300px', height: '200px' }}></video>
            </div>
          )}
        </div>
  
        <div className="w3-container">
          {role === 'host' && (
            <div>
              <SearchBar options={possibleTags} selectedOptions={tags} setSelectedOptions={setTags} />
            </div>
          )}
  
          <div className="w3-container w3-center">
            <p>Tags:</p>
  
            <div className="w3-container w3-center">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="w3-tag w3-round w3-light-grey w3-margin-right w3-margin-bottom"
                >
                  <button className="w3-button w3-round w3-margin-left" onClick={() => handleRemoveTag(tag.id)}>
                    {tag.tag_name} <label className="w3-text-lightgrey"> x</label>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  

                    

    
}

export default Prejoin;
