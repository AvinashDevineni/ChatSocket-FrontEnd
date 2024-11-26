import './LabeledText.css';

export default function LabeledText({ imgSrc, imgSize, text, gap }) {
    return (
        <>
            <div className='labeled-text' style={{gap: `${gap}px`}}>
                <img src={imgSrc} width={imgSize} height={imgSize}/>
                <p>{text}</p>
            </div>
        </>
    );
};