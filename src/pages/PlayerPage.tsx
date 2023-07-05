import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { useParams } from 'react-router-dom';
import Headers from '../components/Header';

const Player: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videoName } = useParams();
  const videoUrl = `https://edu-recordings.s3.amazonaws.com/${videoName}.m3u8`;
  useEffect(() => {
    let hls: Hls | null = null;

    const videoElement = videoRef.current;
    if (videoElement) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoElement);
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = videoUrl;
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoUrl]);

  return (
    <div className="w3-container">
      <Headers></Headers>
      <video className="w3-border" controls ref={videoRef}>
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
};

export default Player;
