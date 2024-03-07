import React, { useEffect, useState } from 'react';
import SwitchTimerTabs from './Tabs/SwitchTimerTabs.jsx';
import PomodoroComponent from './Tabs/Pomodoros.jsx';
import TODOComponent from './TODOList.jsx';
import StopWatchComponent from './Timers/StopWatch.jsx';
import CountdownComponent from './Timers/Countdown.jsx';


const RenderComponent = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [curPom, setCurPom] = useState(0);

  const [secs, setSecs] = useState(0);
  const [mins, setMins] = useState(0);
  const [hrs, setHrs] = useState(0);

  const [combinedTime, setCombinedTime] = useState('');

  useEffect((() => {
    let timeString = '';
    if(hrs < 10) {
      timeString += 0;
    }
      timeString += hrs + ':';
    if(mins < 10) {
      timeString += 0;
    }
      timeString += mins + ':';
    if(secs < 10) {
      timeString += 0;
    }
      timeString += secs;

      setCombinedTime(timeString);
  }),
  [secs, mins, hrs]);

  return (
    <>
      <SwitchTimerTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
        {currentTab === 0 ? 
        <StopWatchComponent hrs={hrs} mins={mins} secs={secs} setSecs={setSecs} setMins={setMins} setHrs={setHrs} combinedTime={combinedTime} /> 
        : 
        <CountdownComponent hrs={hrs} mins={mins} secs={secs} setSecs={setSecs} setMins={setMins} setHrs={setHrs} combinedTime={combinedTime} />
        }
      <PomodoroComponent curPom={curPom} setCurPom={setCurPom} />
      <br/>
      <TODOComponent todoIndex={curPom} combinedTime={combinedTime} />
    </>
  ) 
}

export default RenderComponent;