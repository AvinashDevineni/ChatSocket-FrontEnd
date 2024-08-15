import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import Messages from './Messages.jsx';
import { API_URL_NO_PROTOCOL } from '../../constants/ApiUrl.js';

import './RoomMessaging.css';

export default function RoomMessaging() {
    const { name } = useParams();
    const [messages, setMessages] = useState([]);
    const textAreaRef = useRef();
    const ws = useRef();

    useEffect(() => {
        const updateMessages = msg => {
            msg.data.text().then(msgData => setMessages(msgs => msgs.concat(JSON.parse(msgData))));
        };

        ws.current = new WebSocket(`ws://${API_URL_NO_PROTOCOL}/room/${name}`);
        ws.current.addEventListener('message', updateMessages);
        
        return () => {
            ws.current.removeEventListener('message', updateMessages);
            ws.current.close();
        };
    }, []);

    return (
        <>
            <h1 id="room-name">{name}</h1>
            <textarea ref={textAreaRef} id="msg-input"></textarea>
            <button id="send-msg" onClick={() => {
                ws.current.send(JSON.stringify({ 
                    from: 'user', message: textAreaRef.current.value
                }));
             }}>
                Send
            </button>
            
             <Messages messages={messages} msgFromToStyle={(from) => {
                if (from === 'user')
                    return { backgroundColor: 'black', color: 'white' };
                else if (from === 'server')
                    return { backgroundColor: 'gray' };
                else throw new Error(`Unknown from (${from}) was given.`);
              }}/>
        </>
    );
};