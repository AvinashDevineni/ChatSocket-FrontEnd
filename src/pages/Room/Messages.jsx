import './Messages.css';

export default function Messages({ messages, msgFromToWrapperStyle, msgFromToMsgStyle }) {
    return (
        <>
            <div id='messages-list'>
                {messages.map((msgData, i) => {
                    return (
                        <div className='message-wrapper' style={msgFromToWrapperStyle(msgData.from, msgData.message)}>
                            <p key={i} className='message' style={msgFromToMsgStyle(msgData.from, msgData.message)}>
                                {msgData.message}
                            </p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};