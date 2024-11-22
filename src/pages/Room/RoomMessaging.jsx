import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet';

import Messages from './Messages.jsx';

import { API_URL_NO_PROTOCOL } from '../../constants/ApiUrl.js';

import BackArrow from '../../public/back-arrow.svg';
import './RoomMessaging.css';
import { Link } from 'react-router-dom';

export default function RoomMessaging() {
    const { name } = useParams();
    const [messages, setMessages] = useState([]);
    const textAreaRef = useRef();
    const ws = useRef();

    useEffect(() => {
        const updateMessages = msg => {
            msg.data.text().then(msgData => setMessages(msgs => {
                console.log(msgs);
                return msgs.concat(JSON.parse(msgData));
            }));
        };

        ws.current = new WebSocket(`ws://${API_URL_NO_PROTOCOL}/room/${name}`);
        ws.current.addEventListener('message', updateMessages);
        
        return () => {
            ws.current.removeEventListener('message', updateMessages);
            ws.current.close();
        };
    }, []);

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    return (
        <>
            <Helmet><title>ChatSocket Room</title></Helmet>
            
            <div id='room-messaging-top'>
                <Link to='/'>
                    <img id='back-arrow' src={BackArrow} width={50} height={50}/>
                </Link>
                <h1 id="room-name">{name}</h1>
            </div>
            
            <Messages messages={messages} msgInfoToWrapperStyle={from => {
                if (from === 'user')
                    return { backgroundColor: 'black', color: 'white', width: 'fit-content', maxWidth: 'max(50%, 250px)', alignSelf: 'flex-start' };
                else if (from === 'server')
                    return { backgroundColor: 'gray', width: '95%', borderRadius: '10px', textAlign: 'center' };
                else throw new Error(`Unknown from (${from}) was given.`);
             }}
             msgInfoToMsgStyle={(from, msg) => {
                if (from === 'server')
                    return { margin: '5px 0px' };

                else if (from === 'user') {
                    const userMsgStyles = {};
                    if (msg.length > 100)
                        userMsgStyles['margin'] = '30px 30px';
                    return userMsgStyles;
                }
                    
                else throw new Error(`Unknown from (${from}) was given.`);
             }}/>

            <div id='room-messaging'>
                <textarea ref={textAreaRef} id="msg-input"/>
                <button id="send-msg" onClick={() => {
                    ws.current.send(JSON.stringify({ 
                        from: 'user', message: textAreaRef.current.value
                    }));
                    textAreaRef.current.value = '';
                }}>
                    Send
                </button>
            </div>
        </>
    );
};
