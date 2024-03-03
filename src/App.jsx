import React, { useEffect, useRef, useState } from 'react';

let exportedTime = '';

const TODOComponent = () => {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [todoTime, setTodoTime] = useState([]);
  const [indexToRemove, setIndexToRemove] = useState(-1);
  const [editModeIndex, setEditModeIndex] = useState(-1);
  const [showWarning, setShowWarning] = useState(false);
  const inputRef = useRef(null);

  const WarningComponent = () => {
    const modalStyle = {
        borderStyle: 'solid',
        borderRadius: 20,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '40px',
        backgroundColor: '#0F0D0D',
        transitionDuration: '0.4s',
        fontSize: 15,
    };
    
    return (
        <>
            <p style={modalStyle}>
                Warning: This process cannot be undone
                <p>
                    <button
                    onClick={() => {
                      setTodoList([]);
                      setTodoTime([]);
                      setEditModeIndex(-1);
                      saveTodoListToLocalStorage(todoList, todoTime);
                      setShowWarning(false);
                    }}
                    >
                        DELETE
                    </button>
                    <button
                    onClick={() => {
                      setShowWarning(false);
                    }}>
                        CANCEL
                    </button>
                </p>
                
            </p>
        </>
    );
};

  const handleEdit = (indexToEdit) => {
    const newTodoList = [...todoList];
    newTodoList[indexToEdit] = todo;
    setTodoList(newTodoList);
    setEditModeIndex(-1);
    saveTodoListToLocalStorage(newTodoList, todoTime); // working
  };

  const handleAdd = (todoToAdd) => {
    setTodoList([...todoList, todoToAdd]); 
          inputRef.current.select(); 
          setTodoTime([...todoTime, exportedTime]);
          saveTodoListToLocalStorage(todoList, todoTime); // not working as expected for some reason (same issue like in the delete button)
  }

  const saveTodoListToLocalStorage  = (list, timeList) => {
    localStorage.setItem('todoList', JSON.stringify(list));
    localStorage.setItem('todoTimes', JSON.stringify(timeList));
  };

  useEffect(() => {
    const importJSON = () => {
      const storedTodoList = localStorage.getItem('todoList');
      const storedTodoTimeList = localStorage.getItem('todoTimes');
      if (storedTodoList && storedTodoTimeList) {
        setTodoList(JSON.parse(storedTodoList));
        setTodoTime(JSON.parse(storedTodoTimeList));
      }
    };
    importJSON();
  }, []);

  const handleEnterClick = event => {
    if(event.key === 'Enter') {
      handleAdd(event.target.value);
    }
  }
  
  return (
    <>
      <input
        ref={inputRef}
        placeholder='Add to list...'
        type='text'
        value={todo}
        onChange={e => setTodo(e.target.value)}
        onKeyDown={handleEnterClick} // Still needs to be tested
      />

      <button
        onClick={ (editModeIndex !== -1 ? () => {handleEdit(editModeIndex);} : 
        // on both states the todo list gets saved. Kinda wierd bandaid fix
        () => {todo === '' ? saveTodoListToLocalStorage(todoList, todoTime) : 
          setTodoList([...todoList, todo]); 
          inputRef.current.select(); 
          setTodoTime([...todoTime, exportedTime]);
          saveTodoListToLocalStorage(todoList, todoTime); // not working as expected for some reason (same issue like in the delete button)
          }) 
        }>
        {editModeIndex !== -1 ? 'Edit!' : 'Add to List'}
      </button>
      {' '}
      <button
      onClick={() => {
        setShowWarning(true);
      }}>
        Delete All
      </button>

      {editModeIndex !== -1 && ' ' + editModeIndex}

      {todoList.map((element, index) => (
        <p key={index} className={index == indexToRemove ? 'removeAnimation' : ''} 
        style={{ transitionDuration: '0.2s',
        ...(editModeIndex == index ? {color: 'red', marginLeft: '30px'} : {marginLeft: '10px'}),
        borderStyle: 'solid'
        }}>
          
          <button
            onClick={() => { 
              setEditModeIndex(-1);
              setIndexToRemove(index);
              setTimeout(() => {
                setTodoList([...todoList.slice(0, index), ...todoList.slice(index + 1)]);
                setTodoTime([...todoTime.slice(0, index), ...todoTime.slice(index + 1)]);
                setIndexToRemove(-1);
                saveTodoListToLocalStorage(todoList, todoTime); // not working as expected for some reason (last element gets ignored you see changes when you delete a min of 2 elements)
            }, 100);
          }
            }
          >
            ✖
          </button>
          {' '}
          <button onClick={() => {
            setEditModeIndex(index);
            inputRef.current.select();
            setTodo(element);
          }}>🖋</button>
          <span style={{ transitionDuration: '0.4s', borderStyle: 'groove', borderRadius: '10px',  ...(editModeIndex == index ? {marginLeft: '10px', padding: '10px'} : {padding: '5px'}) }}>
            {' '} {index} {element}
          </span>
          {' '}
          <span style={{ transitionDuration: '0.4s', borderStyle: 'groove', borderRadius: '10px',  ...(editModeIndex == index ? {marginLeft: '2px', padding: '10px'} : {padding: '5px'}) }}>
            {todoTime[index]}
          </span>

        </p>
      ))}
      {showWarning && WarningComponent()}
    </>
  );
};

const TimerComponent = () => {
  const [secs, setSecs] = useState(0);
  const [mins, setMins] = useState(0);
  const [hrs, setHrs] = useState(0);
  const [runTimer, setRunTimer] = useState(false);
  const [beepin, setBeepin] = useState(true);

  exportedTime = '' + hrs + ':' + mins + ':' + secs;

  // ADD a delete all button
  // ADD importing saved todoList when browser closes/refreshes BUGGED
  // ADD when the list is bigger than the screen it scrolls to the bottom
  // ADD use commonancestors to make both warningcomponent and todocomponent have access to the todolist and so there can be a warning displayed
    // ADD an animation to the displayed modal
  // FIX the browser not running the timer anymore when unfocused

  // ADD a countdown tab HARD
  
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
      {hrs < 10 ? '0'+hrs : hrs}:{mins < 10 ? '0'+mins : mins}:{secs < 10 ? '0'+secs : secs}
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

const Tabs = ({ currentTab, setCurrentTab }) => {
  
  return (
    <p className='tabs-container'>
      <span
      style={{ backgroundColor: (currentTab == 0 ? 'green' : ''), paddingInline: (currentTab == 0 ? '25vw' : '15vw')}}
      onClick={() => setCurrentTab(0)}>
        Stopwatch
      </span>
      {' '}
      <span
      style={{ backgroundColor: (currentTab == 1 ? 'green' : ''), paddingInline: (currentTab == 1 ? '25vw' : '15vw')}}
      onClick={() => setCurrentTab(1)}>
        CountdownWIP
      </span>
    </p>
  );
};

const CountdownComponent = () => {
  const [secs, setSecs] = useState(59);
  const [mins, setMins] = useState(59);
  const [hrs, setHrs] = useState(59);
  const [runTimer, setRunTimer] = useState(false);
  const [beepin, setBeepin] = useState(true);


  // puts the times in the elements consider creating separate todolists for countdown and stopwatch
  exportedTime = '' + hrs + ':' + mins + ':' + secs;
  
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
    <p style={{fontSize: 100, margin: 30, display: 'flex', justifyContent: 'center', color: 'orange'}} className={beepin || runTimer || secs == 59 && mins == 59 && hrs == 59 ? 'beep-in' : 'beep-out'}>
      {hrs < 10 ? '0'+hrs : hrs}:{mins < 10 ? '0'+mins : mins}:{secs < 10 ? '0'+secs : secs}
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


const RenderComponent = () => {
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <>
      <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 0 ? <TimerComponent /> : <CountdownComponent />}
      {TODOComponent()}
    </>
  ) 
}

export default RenderComponent;