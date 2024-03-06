import React, { useEffect, useRef, useState } from 'react';
import Tabs from "./Tabs.jsx";
import PomodoroComponent from './Pomodoros.jsx';

let exportedTime = '';

const TODOComponent = ({ todoIndex }) => {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [doneTodoList, setDoneTodoList] = useState([]);
  const [todoTime, setTodoTime] = useState([]);
  const [indexToRemove, setIndexToRemove] = useState(-1);
  const [editModeIndex, setEditModeIndex] = useState(-1);
  const [showWarning, setShowWarning] = useState(false);
  const pRefs = useRef([]);
  // const [newWindow, setNewWindow] = useState(null);
  const inputRef = useRef(null);
  const generalTodoFieldStyles = {
    transitionDuration: '0.4s', 
    borderStyle: 'groove', 
    borderRadius: '10px',
    backgroundColor: '#242424'
  }

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
        <div>
            <p style={modalStyle} className='showWarning'>
                Warning: This process cannot be undone
                <p>
                    <button
                    onClick={(event) => {
                      setTodoList([]);
                      setTodoTime([]);
                      setDoneTodoList([]);
                      setEditModeIndex(-1);
                      saveTodoListToLocalStorage([], [], []);
                      event.target.parentNode.parentNode.classList.add('removeWarning');
                      setTimeout(() => {
                        setShowWarning(false);
                      }, 300);
                    }}
                    >
                        DELETE
                    </button>
                    <button
                    onClick={(event) => {
                      event.target.parentNode.parentNode.classList.add('removeWarning');
                      setTimeout(() => {
                        setShowWarning(false);
                      }, 300);
                    }}>
                        CANCEL
                    </button>
                </p>
                
            </p>
        </div>
    );
};

  const handleEdit = (indexToEdit) => {
    const newTodoList = [...todoList];
    newTodoList[indexToEdit] = todo;
    setTodoList(newTodoList);
    setEditModeIndex(-1);
    saveTodoListToLocalStorage(newTodoList, todoTime, doneTodoList);
  };

  const handleAdd = (todoToAdd) => { // a new todoTime isnt passed could be problematic
    if(todoToAdd !== '') {
      const newTodoList = [...todoList, todoToAdd];
      const newTodoTime = [...todoTime, exportedTime]
      setTodoList(newTodoList);
      setTodoTime(newTodoTime);
      saveTodoListToLocalStorage(newTodoList, newTodoTime, doneTodoList);
    }
      inputRef.current.select();
  }

  const saveTodoListToLocalStorage = (list, timeList, doneList) => {
    localStorage.setItem(`todoList${todoIndex}`, JSON.stringify(list));
    localStorage.setItem(`todoTimes${todoIndex}`, JSON.stringify(timeList));
    localStorage.setItem(`doneTodoList${todoIndex}`, JSON.stringify(doneList));
  };

  // FIX the todo entries getting inserted for all lists on adding elements to the first list in the first time
  // ADD a way to change the amount of pomodoros/pomodorolists
    // CONSIDER: the todoJSONs are still on the local machine so you should delete them when the corresponding pomodoro gets removed

  useEffect(() => {
    const importJSON = () => {
      const storedTodoList = localStorage.getItem(`todoList${todoIndex}`);
      const storedTodoTimeList = localStorage.getItem(`todoTimes${todoIndex}`);
      const storedDoneTodoList = localStorage.getItem(`doneTodoList${todoIndex}`);
      if (storedTodoList && storedTodoTimeList) {
        setTodoList(JSON.parse(storedTodoList));
        setTodoTime(JSON.parse(storedTodoTimeList));
        if (storedDoneTodoList) {
          setDoneTodoList(JSON.parse(storedDoneTodoList)); // FIX when switching the pomodorotab it deletes the donetodolist
      }
      }
    };
    importJSON();
    setEditModeIndex(-1);
  }, [todoIndex]);

  const handleEnterClick = event => {
    if(event.key === 'Enter') {
      handleAdd(event.target.value);
      setEditModeIndex(-1);
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
          () => handleAdd(todo)
        )}>
        {editModeIndex !== -1 ? 'Edit!' : 'Add to List'}
      </button>
      {' '}
      <button
      onClick={() => {
        setShowWarning(true);
      }}>
        Delete All
      </button>
      {' '}

      {editModeIndex !== -1 && ' ' + editModeIndex}

      {todoList.map((element, index) => (
        <p key={index} ref={(element) => (pRefs.current[index] = element)}
        data-
        onDoubleClick={() => {
          setEditModeIndex(index);
          inputRef.current.select();
          setTodo(element);
        }}
        className={'todoEntry ' + (index == indexToRemove ? 'removeAnimation' : '')} //
        style={{ 
          transitionDuration: '0.15s',
          cursor: 'pointer',
        ...(editModeIndex == index ? {color: 'red', marginLeft: '30px', backgroundColor: '#201717', borderRadius: 25} : {}),
        border: '1px solid transparent',
        padding: 10,
        }}>
          
          <button
            onClick={() => { 
              setEditModeIndex(-1);
              setIndexToRemove(index);
              const newTodoList = [...todoList.slice(0, index), ...todoList.slice(index + 1)];
              const newTodotime = [...todoTime.slice(0, index), ...todoTime.slice(index + 1)];
              // const openedWindow = window.open("", "_blank", "width=200,height=200");
              // setNewWindow(openedWindow);
              setTimeout(() => {
                setTodoList(newTodoList);
                setTodoTime(newTodotime);
                setIndexToRemove(-1);
                saveTodoListToLocalStorage(newTodoList, newTodotime, doneTodoList);
            }, 100);
          }}
          >
            ✖
          </button>
          {' '}
          <button onClick={() => {
            setEditModeIndex(index);
            inputRef.current.select();
            setTodo(element);
          }}>🖋</button>
          {' '}
          <span style={{ ...generalTodoFieldStyles,  ...(editModeIndex == index ? {marginLeft: '10px', padding: 2, paddingInline: 25} : {paddingInline: 20})}}>
            {index}
          </span>
          {' '} 
          <span style={{ ...generalTodoFieldStyles,  ...(editModeIndex == index ? {padding: '10px'} : {padding: '5px'}) }}>
            {element}
          </span>
          {' '}
          <span style={{ ...generalTodoFieldStyles,  ...(editModeIndex == index ? {marginLeft: '2px', padding: '10px'} : {padding: '5px'}) }}>
            {todoTime[index]}
          </span>

          <span className='moveupdown'>
            <button className='b1'
            onClick={() => {
              // FIX the time also needs to be moved
              if (index <= 0) return;
              const newTodoList = [...todoList];
              const elementToMove = newTodoList.splice(index, 1)[0];
              newTodoList.splice(index-1, 0, elementToMove);
              pRefs.current[index].classList.add('fadeupanim');
              pRefs.current[index-1].classList.add('fadedownanim');
              setTimeout(() => {
                setTodoList(newTodoList);
              }, 200);
              setTimeout(() => {
                pRefs.current[index].classList.remove('fadeupanim');
                pRefs.current[index-1].classList.remove('fadedownanim');
              }, 400);
            }}>
              🔼
            </button>
            <button className='b2'
            onClick={() => {
              if (index == todoList.length -1) return;
              const newTodoList = [...todoList];
              const elementToMove = newTodoList.splice(index, 1)[0];
              newTodoList.splice(index+2, 0, elementToMove);
              pRefs.current[index].classList.add('fadedownanim');
              pRefs.current[index+1].classList.add('fadeupanim')
              setTimeout(() => {
                setTodoList(newTodoList);
              }, 200);
              setTimeout(() => {
                pRefs.current[index].classList.remove('fadedownanim');
                pRefs.current[index+1].classList.remove('fadeupanim');
              }, 400);
            }}>
              🔽
            </button>
          </span>
          <button style={{borderRadius: 50, marginLeft: 40, paddingInline: 15}}
            onClick={() => { 
              setEditModeIndex(-1);
              setIndexToRemove(index);
              const newTodoList = [...todoList.slice(0, index), ...todoList.slice(index + 1)];
              const newTodoTime = [...todoTime.slice(0, index), ...todoTime.slice(index + 1)];
              setTimeout(() => {
                setTodoList(newTodoList);
                setTodoTime(newTodoTime);
                setDoneTodoList([...doneTodoList, element]); // hier // eventuell mit newDoneList implementieren
                setIndexToRemove(-1);
                saveTodoListToLocalStorage(newTodoList, newTodoTime, doneTodoList);
            }, 100);
          }}> 
            ✓
          </button>

        </p>
      ))}
      {doneTodoList.map((element, /* index */) => (
        <p style={{textDecoration: 'line-through'}}>
          {element}
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


  const [editCountdown, setEditCountdown] = useState(true);
  const digitInputStyle = {
    width: 100, 
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
        type='text'
        value={hrs}
        maxLength='2'
        onChange={e => setHrs(e.target.value)}
        />
        :
        <input style={digitInputStyle}
        type='text'
        value={mins}
        maxLength='2'
        onChange={e => setMins(e.target.value)}
        />
        :
        <input style={digitInputStyle}
        type='text'
        value={secs}
        maxLength='2'
        onChange={e => setSecs(e.target.value)}
        />
        <span />
      </div>
      </>
      :
      <p
      style={{fontSize: 100, margin: 30, display: 'flex', justifyContent: 'center', color: 'orange', cursor: 'pointer'}} className={beepin || runTimer || secs == 59 && mins == 59 && hrs == 59 ? 'beep-in' : 'beep-out'}
      onDoubleClick={() => setEditCountdown(true)}>
        {hrs < 10 ? '0'+hrs : hrs}:{mins < 10 ? '0'+mins : mins}:{secs < 10 ? '0'+secs : secs}
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


const RenderComponent = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [curPom, setCurPom] = useState(0);

  return (
    <>
      <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 0 ? <TimerComponent /> : <CountdownComponent />}
      <PomodoroComponent curPom={curPom} setCurPom={setCurPom} />
      <br/>
      <TODOComponent todoIndex={curPom} />
    </>
  ) 
}

export default RenderComponent;