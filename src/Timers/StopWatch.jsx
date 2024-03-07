import React, { useEffect, useState } from 'react';

const StopWatchComponent = ({ secs, mins, hrs, setSecs, setMins, setHrs, combinedTime }) => {
    const [runTimer, setRunTimer] = useState(false);
    const [beepin, setBeepin] = useState(true);
  
    // ADD importing saved todoList when browser closes/refreshes BUGGED
    // ADD when the list is bigger than the screen it scrolls to the bottom
    // ADD use commonancestors to make both warningcomponent and todocomponent have access to the todolist and so there can be a warning displayed
    // FIX the browser not running the timer anymore when unfocused
    
    useEffect(() => {
      const timer = setInterval(() => {
        if (runTimer) {
          document.title = `T: ${hrs}:${mins}:${secs}`;
          setSecs(previousSecs => (previousSecs + 1) % 60);
          if (secs === 59) {
            setMins(previousMins => (previousMins + 1) % 60);
            if (mins === 59) {
              setHrs(previousHrs => previousHrs + 1);
            }
          }
        }
      }, 1000);
    
      return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hrs, mins, runTimer, secs]);
    
  
    useEffect(() => {
      const beeper = setInterval(() => {
        if(!runTimer) {
          setBeepin(prev => !prev)
        }
      }, 700);
  
      return () => clearInterval(beeper);
    }, [runTimer]);
  
  
    // checking if secs == 0 && mins == 0 && hrs == 0 could be too intensive maybe remove it?
    return (
      <>
      <p style={{fontSize: 100, margin: 30, display: 'flex', justifyContent: 'center', color: 'yellow'}} className={beepin || runTimer || secs == 0 && mins == 0 && hrs == 0 ? 'beep-in' : 'beep-out'}>
        {combinedTime}
      </p>
      <p>
        <button
        onClick={ () => {
          setSecs(0);
          setMins(0);
          setHrs(0);
          setRunTimer(false);
          document.title = `T: 0:0:0`
        }}>
          Reset
        </button>
        {' '}
        <button
          onClick={() => setRunTimer(prev => !prev)}
        > {secs == 0 && mins == 0 && hrs == 0 ? 'Start Timer!' : runTimer ? 'Stop Timer' : 'Resume Timer'} </button>
      </p>
      </>
    )
  };

export default StopWatchComponent;