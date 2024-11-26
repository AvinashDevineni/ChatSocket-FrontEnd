import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import LabeledText from '../../components/LabeledText';

import PeopleIcon from '../../public/people.png';

import './Room.css';

export default function Room({ name, numPeople, creationTime, link, onClick }) {
   const [age, setAge] = useState(() => calculateAge());
   
   function calculateAge() {
      const ageMs = new Date().getTime() - creationTime.getTime();
      const ageSecs = ageMs / 1000;
      const ageMins = ageSecs / 60;
      const ageHrs = ageMins / 60;
      const ageDays = ageHrs / 24;

      if (ageMins >= 1)
         return `${Math.round(ageMins)} min${Math.round(ageMins) == 1 ? '' : 's'}`;
      else if (ageHrs >= 1)
         return `${Math.round(ageHrs)} hr${Math.round(ageHrs) == 1 ? '' : 's'}`;
      else if (ageDays >= 1)
         return `${Math.round(ageHrs)} day${Math.round(ageDays) == 1 ? '' : 's'}`;
      else return `${Math.round(ageSecs)} sec${Math.round(ageSecs) == 1 ? '' : 's'}`;
   }

   useEffect(() => {
      const interval = setInterval(() => {
         if (age !== calculateAge())
            setAge(calculateAge());
      }, 1000);

      return () => clearInterval(interval);
   }, []);
   
   return (
      <>
         <Link className='room' to={link} onClick={e => {
            if (onClick)
               onClick(e);
          }}>
            <h1 className='room-name'>{name}</h1>
            <LabeledText imgSrc={PeopleIcon} imgSize={20} text={numPeople} gap={10}/>
            <p>{age}</p>
         </Link>
      </>
   );
};