import { useEffect, useRef, useState } from "react";

import RoomCreator from './RoomCreator.jsx';
import Room from './Room.jsx';
import { API_URL_NO_PROTOCOL } from '../../constants/ApiUrl.js';

import './Rooms.css';
import { useNavigate } from "react-router-dom";

export default function Rooms() {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const roomNameToInfoDict = useRef({});

    const createRoomController = useRef(new AbortController());
    const ws = useRef();
    
    function makeRoomFromInfo(roomInfo) {
        return <Room key={roomInfo.name} name={roomInfo.name} numPeople={roomInfo.numPeople}
                onClick={() => {
                    ws.current.close();
                    navigate(`/room/${roomInfo.uri}`);
                }}/>;
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        // getting rooms
        fetch(`http://${API_URL_NO_PROTOCOL}/room`, {signal})
        .then(res => res.json()).then(roomInfo => {
            setRooms(roomInfo.rooms.map(roomInfo => makeRoomFromInfo(roomInfo)));
            for (let i = 0; i < roomInfo.rooms.length; i++)
                roomNameToInfoDict.current[roomInfo.rooms[i].name] = { ...roomInfo.rooms[i], idx: i };            
        }).catch(e => console.error(e));

        // creates & updates room UIs
        const handleRoomsUpdate = msg => {
            msg.data.text().then(msgString => {
                const wss = JSON.parse(msgString);
                // updating room if it already exists
                if (wss.name in roomNameToInfoDict.current) {
                    roomNameToInfoDict.current[wss.name].numPeople = wss.numPeople;

                    setRooms(rooms => rooms.map((room, i) => {
                        if (i == roomNameToInfoDict.current[wss.name].idx)
                            return makeRoomFromInfo(roomNameToInfoDict.current[wss.name]);
                        return room;
                    }));
                }

                // adding room if it doesn't exist
                else {
                    setRooms(rooms => {
                        roomNameToInfoDict.current[wss.name] = { ...wss, idx: rooms.length };
                        return rooms.concat(makeRoomFromInfo(wss));
                    });
                }
            });
        };
        
        ws.current = new WebSocket(`ws://${API_URL_NO_PROTOCOL}`);
        ws.current.addEventListener('message', handleRoomsUpdate);

        return () => {
            ws.current.removeEventListener('message', handleRoomsUpdate);
            ws.current.close();

            controller.abort();
            createRoomController.current.abort();
        };
    }, []);
    
    return (
        <>
            <RoomCreator onRoomCreate={roomName => {
                createRoomController.current.abort();
                createRoomController.current = new AbortController();
                const signal = createRoomController.current.signal;
                                
                fetch(`http://${API_URL_NO_PROTOCOL}/room`, {
                    method: 'POST', body: JSON.stringify({ roomName: roomName }),
                    headers: {
                        "Content-Type": "application/json"
                    }, signal
                }).then(res => res.json()).then(res => {
                    if (res.code === 'ROOM_DUPE')
                        alert('The room already exists!');
                })
                .catch(e => console.log(e));
             }}/>

            <ul id="rooms-list">{rooms}</ul>
        </>
    );
}