import { Link } from 'react-router-dom';
import './Room.css';

export default function Room({ name, numPeople, link, onClick }) {
   return (
      <>
         <Link className='room' to={link} onClick={e => {
            if (onClick)
               onClick(e);
          }}>
            <h1 className='room-name'>{name}</h1>
            <p className='num-people'>{numPeople}</p>
         </Link>
      </>
   );
};