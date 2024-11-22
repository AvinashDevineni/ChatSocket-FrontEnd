import './Messages.css';

export default function Messages({ messages, msgInfoToWrapperStyle, msgInfoToMsgStyle }) {
    return (
        <>
            <div id='messages-list'>
                {messages.map((msgData, i) => {
                    return (
                        <div className='message-wrapper' style={msgInfoToWrapperStyle(msgData.from, msgData.message)}>
                            <p key={i} className='message' style={msgInfoToMsgStyle(msgData.from, msgData.message)}>
                                {msgData.message}
                            </p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};