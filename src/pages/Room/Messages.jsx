import './Messages.css'

export default function Messages({ messages, msgFromToStyle }) {
    return (
        <>
            <ul>
                {messages.map((msgData, i) => {
                    return <p style={msgFromToStyle(msgData.from)} key={i}>{msgData.message}</p>;
                })}
            </ul>
        </>
    );
};