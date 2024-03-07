import React, { useEffect, useState } from 'react';

const CountdownComponent = ({ secs, hrs, mins, setSecs, setMins, setHrs, combinedTime }) => {
    const [runTimer, setRunTimer] = useState(false);
    const [beepin, setBeepin] = useState(true);
  
  
    // puts the times in the elements consider creating separate todolists for countdown and stopwatch
    
    useEffect(() => {
      const timer = setInterval(() => {
        if (runTimer && (hrs != 0 || mins != 0 || secs != 0)) {
          document.title = `T: ${hrs}:${mins}:${secs}`;
          setSecs(previousSecs => (previousSecs - 1 + 60) % 60);
          if (secs === 0) {
            setMins(previousMins => (previousMins - 1 + 60) % 60);
            if (mins === 0) {
              setHrs(previousHrs => (previousHrs - 1 + 60) % 60);
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
  
  
    const [editCountdown, setEditCountdown] = useState(true);
    const digitInputStyle = {
      width: 120, 
      textAlign: 'center', 
      fontSize: 90,
      backgroundColor: 'transparent',
      borderRadius: 20,
      // borderStyle: 'none',
      // color: 'orange',
    };
  
    // checking if secs == 0 && mins == 0 && hrs == 0 could be too intensive maybe remove it?
    return (
      <>
        {editCountdown ?
        <>
        <br/>
        <br/>
        {/* ADD give the user a hint that they can double click to edit a todo and the countdown */}
        <div className='editableCountdown'
          onDoubleClick={() => {
            setEditCountdown(false);
          }}>
          <span />
          <input style={digitInputStyle}
          type='number'
          value={hrs}
          maxLength={2}
          onChange={e => setHrs(Math.abs(e.target.value))}
          onClick={event => event.target.select()}
          />
          :
          <input style={digitInputStyle}
          type='number'
          value={mins}
          maxLength={2}
          onChange={e => setMins(Math.abs(e.target.value))}
          onClick={event => event.target.select()}
          />
          :
          <input style={digitInputStyle}
          type='number'
          value={secs}
          maxLength={2}
          onChange={e => setSecs(Math.abs(e.target.value))}
          onClick={event => event.target.select()}
          />
          <span />
        </div>
        </>
        :
        <p
        style={{fontSize: 100, margin: 30, display: 'flex', justifyContent: 'center', color: 'orange', cursor: 'pointer'}} className={beepin || runTimer || secs == 59 && mins == 59 && hrs == 59 ? 'beep-in' : 'beep-out'}
        onDoubleClick={() => setEditCountdown(true)}>
          {combinedTime}
          <br/>
        </p>
      }
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

export default CountdownComponent;