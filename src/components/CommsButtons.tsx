import React from 'react';

interface CommsButtonsProps {
  toggleMute: () => void;
  isMuted: boolean;
  toggleVideo: () => void;
  isVideoOff: boolean;
  toggleScreenShare: () => void;
  isScreenSharing: boolean;
  joinRTC: () => void;
  isJoined: boolean;
  handleRecording: () => void;
  isRecording: boolean;
  toggleChat: () => void;
  isLecturer: string;
}

const CommsButtons: React.FC<CommsButtonsProps> = ({
  toggleMute,
  isMuted,
  toggleVideo,
  isVideoOff,
  toggleScreenShare,
  isScreenSharing,
  joinRTC,
  isJoined,
  handleRecording,
  isRecording,
  toggleChat,
  isLecturer
}) => {
  return (
    <div className="w3-bottom w3-center">
      <div className="w3-bar w3-round w3-grey w3-padding w3-card">
      <button
          className={`w3-button w3-round ${isJoined ? 'w3-red' : 'w3-green'}`}
          onClick={joinRTC}
        >
          {isJoined ? 'Leave Call' : 'Join Call'}
        </button>
        <button
          className={`w3-button w3-round ${isMuted ? 'w3-light-red' : 'w3-light-green'}`}
          onClick={toggleMute}
          disabled={!isJoined}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button
          className={`w3-button w3-round ${isVideoOff ? 'w3-light-red' : 'w3-light-green'}`}
          onClick={toggleVideo}
          disabled={!isJoined}
        >
          {isVideoOff ? 'Turn On Video' : 'Turn Off Video'}
        </button>
        <button
          className={`w3-button w3-round ${isScreenSharing ? 'w3-light-red' : 'w3-light-green'}`}
          onClick={toggleScreenShare}
          disabled={!isJoined}
        >
          {isScreenSharing ? 'Stop Sharing Screen' : 'Share Screen'}
        </button>
        
        {((isLecturer=='host'))?<button
          className={`w3-button w3-round ${isRecording ? 'w3-light-red' : 'w3-light-green'}`}
          onClick={handleRecording}
          disabled={!isJoined}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>:<></>}
        <button className="w3-button w3-round w3-gray" onClick={toggleChat}>
          Toggle Chat
        </button>
      </div>
    </div>
  );
}

export default CommsButtons;
