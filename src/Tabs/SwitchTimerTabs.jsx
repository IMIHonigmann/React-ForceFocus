import React from 'react';

const SwitchTimerTabs = ({ currentTab, setCurrentTab }) => {
  
    return (
      <p className='tabs-container'>
        <span
        style={{ backgroundColor: (currentTab == 0 ? 'green' : ''), paddingInline: (currentTab == 0 ? '25vw' : '15vw')}}
        onClick={() => setCurrentTab(0)}>
          Stopwatch
        </span>
        {' '}
        <span
        style={{ backgroundColor: (currentTab == 1 ? 'green' : ''), paddingInline: (currentTab == 1 ? '25vw' : '15vw'),}}
        onClick={() => setCurrentTab(1)}>
          CountdownWIP
        </span>
      </p>
    );
  };

export default SwitchTimerTabs;
