import React, { useEffect, useRef, useState } from 'react';

let exportedTime = '';

const TODOComponent = () => {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [todoTime, setTodoTime] = useState([]);
  const [indexToRemove, setIndexToRemove] = useState(-1);
  const [editModeIndex, setEditModeIndex] = useState(-1);
  const inputRef = useRef(null);

  const handleEdit = (indexToEdit) => {
    let newTodoList = [...todoList];
    newTodoList[indexToEdit] = todo;
    setTodoList(newTodoList);
    setEditModeIndex(-1);
  };
  
  return (
    <>
      <input
        ref={inputRef}
        placeholder='Add to list...'
        type='text'
        value={todo}
        onChange={e => setTodo(e.target.value)}
      />

      <button
        onClick={ (editModeIndex !== -1 ? () => handleEdit(editModeIndex) : 
          () => {todo === '' ? {} : setTodoList([...todoList, todo]); inputRef.current.select(); setTodoTime([...todoTime, exportedTime])}) }
      >
        {editModeIndex !== -1 ? 'Edit!' : 'Add to List'}
      </button>

      {editModeIndex !== -1 && ' ' + editModeIndex}

      {todoList.map((element, index) => (
        <p key={index} className={index == indexToRemove ? 'removeAnimation' : ''} 
        style={{ transitionDuration: '0.2s',
        ...(editModeIndex == index ? {color: 'red', marginLeft: '30px'} : {marginLeft: '10px'})
        }}>
          
          <button
            onClick={() => { 
              setEditModeIndex(-1);
              setIndexToRemove(index);
              setTimeout(() => {
              setTodoList([...todoList.slice(0, index), ...todoList.slice(index + 1)]);
              setTodoTime([...todoTime.slice(0, index), ...todoTime.slice(index + 1)]);
              setIndexToRemove(-1)
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

  // ADD a reset button
  // ADD an element on enter button
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (runTimer) {
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
  }, [mins, runTimer, secs]);
  

  useEffect(() => {
    const beeper = setInterval(() => {
      if(!runTimer) {
        setBeepin(prev => !prev)
      }
    }, 700);

    return () => clearInterval(beeper);
  }, [runTimer]);

  return (
    <>
    <p style={{fontSize: 100, margin: 30, display: 'flex', justifyContent: 'center', color: 'yellow'}} className={beepin || runTimer ? 'beep-in' : 'beep-out'}>
      {hrs < 10 ? '0'+hrs : hrs}:{mins < 10 ? '0'+mins : mins}:{secs < 10 ? '0'+secs : secs}
    </p>
    <p>
      <button
      onClick={ () => {
        setSecs(0);
        setMins(0);
        setHrs(0);
        setRunTimer(false);
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
  return (
    <>
      {TimerComponent()}
      {TODOComponent()}
    </>
  ) 
}

export default RenderComponent;
