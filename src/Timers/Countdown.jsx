import React, { useEffect, useState } from 'react';

const CountdownComponent = ({ secs, hrs, mins, setSecs, setMins, setHrs, combinedTime }) => {
    const [runTimer, setRunTimer] = useState(false);
    const [beepin, setBeepin] = useState(true);

    const [dHrs, setDHrs] = useState(0);
    const [dMins, setDMins] = useState(0);
    const [dSecs, setDSecs] = useState(1);
  
  
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

    const setNewDefaultTime = () => {
        setDHrs(hrs);
        setDMins(mins);
        setDSecs(secs);
        document.title = `T: ${combinedTime}`;
    }
  
    // checking if secs == 0 && mins == 0 && hrs == 0 could be too intensive maybe remove it?
    return (
      <div className='openCTDAnim'>
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
          onChange={e => {
            setHrs(Math.abs(e.target.value));
            setNewDefaultTime();
          }}
          onClick={event => event.target.select()}
          />
          :
          <input style={digitInputStyle}
          type='number'
          value={mins}
          maxLength={2}
          onChange={e => {
            setMins(Math.abs(e.target.value));
            setNewDefaultTime();
          }}
          onClick={event => event.target.select()}
          />
          :
          <input style={digitInputStyle}
          type='number'
          value={secs}
          maxLength={2}
          onChange={e => {
            setSecs(Math.abs(e.target.value))
            setNewDefaultTime();
          }}
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
          className={secs == dSecs && mins == dMins && hrs == dHrs ? 'ctdDefaultAnim' : 'disappearCTDDefaultAnim'}
          onClick={() => {
            setNewDefaultTime();
          }}>
            Set as default
          </button>
          {' '}
          <button
          onClick={ () => {
            setHrs(dHrs);
            setMins(dMins);
            setSecs(dSecs);
            setRunTimer(false);
            document.title = `T: ${combinedTime}`
          }}>
            Reset
          </button>
          {' '}
          <button
            onClick={() => setRunTimer(prev => !prev)}
          > {secs == dSecs && mins == dMins && hrs == dHrs ? 'Start Timer!' : runTimer ? 'Stop Timer' : 'Resume Timer'} </button>
          {' '}
        </p>
      </div>
    )
  };

export default CountdownComponent;