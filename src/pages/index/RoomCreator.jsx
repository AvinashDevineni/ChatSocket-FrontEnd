import { useRef } from "react";

import './RoomCreator.css';

export default function RoomCreator({ onRoomCreate }) {
    const roomNameInputRef = useRef();

    function invokeIfNotNull(func, arg) {
        if (!func)
            return;
        func(arg);
    }
    
    return (
        <>
            <div id='creator-wrapper'>
                <input type='text' ref={roomNameInputRef} id='room-name-input'/>
                <button className='button' onClick={() => {
                    invokeIfNotNull(onRoomCreate, roomNameInputRef.current.value);
                 }}>
                    Create Room
                </button>
            </div>
        </>
    );
};