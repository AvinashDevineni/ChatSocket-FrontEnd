import { useRef } from "react";

import './RoomCreator.css';

export default function RoomCreator({ onRoomCreate }) {
    const textAreaRef = useRef();

    function invokeIfNotNull(func, arg) {
        if (!func)
            return;
        func(arg);
    }
    
    return (
        <>
            <div id='creator-wrapper'>
                <textarea ref={textAreaRef} id='room-name-input'></textarea>
                <button onClick={() => invokeIfNotNull(onRoomCreate, textAreaRef.current.value)}>Create Room</button>
            </div>
        </>
    );
};