import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Rooms from './pages/RoomsList/Rooms.jsx';
import RoomMessaging from './pages/Room/RoomMessaging.jsx';
import RoomNotFound from './pages/Room/RoomNotFound.jsx';

import './App.css';

export default function App() {
  return (
    <>
      <h1 id='title'>ChatSocket</h1>
      <BrowserRouter>
        <Routes>
          <Route path='' element={<Rooms/>}/>
          <Route path='/room/:name' element={<RoomMessaging/>} errorElement={<RoomNotFound/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}