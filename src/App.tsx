
import './App.css'
import { BrowserRouter, Routes, Route,  } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Player from './pages/PlayerPage';
import StreamPage from './pages/StreamPage';
import Join from './pages/JoinPage';
import Prejoin from './pages/Prejoin';
import AuthGuard from './services/authGuard';
import NotFound from './pages/NotFound';
import Courses from './pages/CoursesPage';
import Analytics from './pages/AnalyticsPage';


function App() {
  return (
    <BrowserRouter basename="/eduModule">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route element={<AuthGuard />} >
          <Route path="/stream/:channelCode" element={<StreamPage/>} />
          <Route path="/prejoin/:channelCode" element={<Prejoin/>} />
          <Route path="/player/:videoName" element={<Player />} />
          <Route path="/join" element={<Join />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
        {/* <Route path='*' element={ <NotFound/>} /> */}
      </Routes>
    </BrowserRouter>
  );
}


export default App
