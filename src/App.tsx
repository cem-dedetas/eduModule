import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Player from './pages/PlayerPage';
import StreamPage from './pages/StreamPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="video-call/" element={<StreamPage />} />
        <Route path="player/" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App
