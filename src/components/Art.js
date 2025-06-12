import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Art.css';
import brush from '../assests/paintbrush.png';


const Art = () => {
  const navigate = useNavigate();
  const [animationEnded, setAnimationEnded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationEnded(true);

      
      setTimeout(() => {
        navigate('/home');
      }, 1000); 
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash splash-red"></div>
      <div className="splash splash-blue"></div>
      <div className="splash splash-yellow"></div>
      <div className="splash splash-purple"></div>

      {!animationEnded && (
        <img
          src={brush}
          alt="Paintbrush"
          className="paintbrush rotate-once"
        />
      )}
    </div>
  );
};

export default Art;