import './Room.css';

export default function Room({ name, numPeople, onClick }) {
   function invokeIfNotNull(func) {
      if (!func)
         return;
      func();
   }

   return (
      <>
         <a className='room' onClick={() => {
            invokeIfNotNull(onClick);
            return false;
          }}>
            <h1 className='room-name'>{name}</h1>
            <p className='num-people'>{numPeople}</p>
         </a>
      </>
   );
};