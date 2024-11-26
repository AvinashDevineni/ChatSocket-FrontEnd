import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Rooms from './pages/index/Rooms.jsx';
import RoomMessaging from './pages/room/RoomMessaging.jsx';
import RoomNotFound from './pages/room/RoomNotFound.jsx';

import './App.css';

export default function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='' element={
						<>
							<h1 id='title'>ChatSocket</h1>
							<Rooms/>
						</>
					 }/>
					<Route path='/room/:name' element={<RoomMessaging/>} errorElement={<RoomNotFound/>} />
				</Routes>
			</BrowserRouter>
		</>
	)
}