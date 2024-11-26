import { Link } from 'react-router-dom';
import './Room.css';

export default function Room({ name, numPeople, link, onClick }) {
   function invokeIfNotNull(func) {
      if (!func)
         return;
      func();
   }

   return (
      <>
         <Link className='room' to={link} onClick={() => invokeIfNotNull(onClick)}>
            <h1 className='room-name'>{name}</h1>
            <p className='num-people'>{numPeople}</p>
         </Link>
      </>
   );
};