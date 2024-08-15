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

    const abortControllers = useRef([]);
    const ws = useRef();

    console.log(roomNameToInfoDict.current);
    
    function makeRoomFromInfo(roomInfo) {
        return <Room key={roomInfo.name} name={roomInfo.name} numPeople={roomInfo.numPeople}
                onClick={() => {
                    ws.current.close();
                    navigate(roomInfo.path);
                }}/>;
    }

    useEffect(() => {
        const curIdx = abortControllers.current.length;
        const abortController = new AbortController();
        abortControllers.current.push(abortController);
        const signal = abortController.signal;

        fetch(`http://${API_URL_NO_PROTOCOL}/room`, {signal})
        .then(res => res.json()).then(roomInfo => {
            setRooms(roomInfo.rooms.map(roomInfo => makeRoomFromInfo(roomInfo)));
            for (let i = 0; i < roomInfo.rooms.length; i++)
                roomNameToInfoDict.current[roomInfo.rooms[i].name] = { ...roomInfo.rooms[i], idx: i };
            console.log(roomNameToInfoDict.current);
            
            abortControllers.current.splice(curIdx, 1);
        }).catch(e => console.error(e));

        const addToRooms = msg => {
            msg.data.text().then(msgString => {
                const wss = JSON.parse(msgString);
                console.log(wss);

                if (!(wss.name in roomNameToInfoDict.current)) {
                    setRooms(rooms => {
                        roomNameToInfoDict.current[wss.name] = { ...wss, idx: rooms.length };
                        return rooms.concat(makeRoomFromInfo(wss));
                    });
                }

                else {
                    roomNameToInfoDict.current[wss.name].numPeople = wss.numPeople;

                    setRooms(rooms => rooms.map((room, i) => {
                        if (i === roomNameToInfoDict.current[wss.name].idx) {
                            console.log('Found same idx');
                            return makeRoomFromInfo(roomNameToInfoDict.current[wss.name]);
                        }

                        else {
                            console.log('Did not find same idx');
                            return room;
                        }
                    }));
                }
            });
        };
        
        ws.current = new WebSocket(`ws://${API_URL_NO_PROTOCOL}`);
        ws.current.addEventListener('message', addToRooms);

        return () => {
            ws.current.removeEventListener('message', addToRooms);
            ws.current.close();

            abortControllers.current.forEach(abortController => abortController.abort());
        };
    }, []);
    
    return (
        <>
            <RoomCreator onRoomCreate={roomName => {
                const curIdx = abortControllers.current.length;
                const abortController = new AbortController();
                abortControllers.current.push(abortController);
                const signal = abortController.signal;

                fetch(`http://${API_URL_NO_PROTOCOL}/room/${roomName}`, {method: 'POST', signal})
                .then(abortControllers.current.splice(curIdx, 1))
                .catch(e => alert(`Error: ${e}`));
                }}/>

            <ul id="rooms-list">{rooms}</ul>
        </>
    );
}