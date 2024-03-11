import React, { useRef, useState, useEffect } from "react";

const TODOComponent = ({ todoIndex, combinedTime, todo, setTodo }) => {
    const [todoList, setTodoList] = useState([]);
    const [doneTodoList, setDoneTodoList] = useState([]);
    const [todoTime, setTodoTime] = useState([]);
    const [indexToRemove, setIndexToRemove] = useState(-1);
    const [editModeIndex, setEditModeIndex] = useState(-1);
    const [showWarning, setShowWarning] = useState(false);
    const [showDoneList, setShowDoneList] = useState(true);
    const pRefs = useRef([]);
    // const [newWindow, setNewWindow] = useState(null);
    const inputRef = useRef(null);
    const generalTodoFieldStyles = {
      transitionDuration: '0.4s', 
      borderStyle: 'groove', 
      borderRadius: '10px',
      backgroundColor: '#242424'
    }

    const [lastTodoIndex, setLastTodoIndex] = useState(1);
    const todoRef = useState(null);
    useEffect(() => {
      if(todoIndex < lastTodoIndex) {
        todoRef.current.className = 'fadefromright';
      }
      else if(todoIndex > lastTodoIndex) {
        todoRef.current.className = 'fadefromleft';
      }
      setLastTodoIndex(todoIndex);
      setTimeout(() => todoRef.current.className = '', 400);
    }, [todoRef, lastTodoIndex, todoIndex]);
  
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
        const newTodoTime = [...todoTime, combinedTime]
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
            setDoneTodoList(JSON.parse(storedDoneTodoList));
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
      <div>
        <input
          style={{paddingTop: 5, paddingBottom: 5, width: 500}}
          ref={inputRef}
          placeholder='Add to list...'
          type='text'
          value={todo}
          onChange={e => setTodo(e.target.value)}
          onKeyDown={handleEnterClick} // Still needs to be tested
        />
        <br/>
        <button
          onClick={ (editModeIndex !== -1 ? () => {handleEdit(editModeIndex);} : 
            () => handleAdd(todo)
          )}>
          {editModeIndex !== -1 ? 'Edit!' : 'Add to List'}
        </button>
        
        <button
        onClick={() => {
          setShowWarning(true);
        }}>
          Delete All
        </button>
        
  
        {editModeIndex !== -1 && ' ' + editModeIndex}
        
        <div ref={todoRef}>
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
            
            <button onClick={() => {
              setEditModeIndex(index);
              inputRef.current.select();
              setTodo(element);
            }}>🖋</button>
            
            <span style={{ ...generalTodoFieldStyles,  ...(editModeIndex == index ? {marginLeft: '10px', padding: 2, paddingInline: 25} : {paddingInline: 20})}}>
              {index}
            </span>
             
            <span style={{ ...generalTodoFieldStyles,  ...(editModeIndex == index ? {padding: '10px'} : {padding: '5px'}) }}>
              {element}
            </span>
            
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
                const newDoneTodoList = [...doneTodoList, element]
                setTimeout(() => {
                  setTodoList(newTodoList);
                  setTodoTime(newTodoTime);
                  setDoneTodoList(newDoneTodoList); // hier // eventuell mit newDoneList implementieren
                  setIndexToRemove(-1);
                  saveTodoListToLocalStorage(newTodoList, newTodoTime, newDoneTodoList);
              }, 100);
            }}> 
              ✓
            </button>
  
          </p>
        ))}
        <br/>
        <br/>
        <div className='doneTodoList'
        onClick={() => setShowDoneList(prev => !prev)}>
          <div style={{marginLeft: 20}}>
            <p className={showDoneList ? 'showDoneList' : 'hideDoneList'}>
              {doneTodoList.map((element, /* index */) => (
                <p style={{textDecoration: 'line-through'}}>
                  {element}
                </p>
              ))}
            </p>
          </div>
        </div>
        </div>
          {/* {showDoneList.toString()} */}
        {showWarning && WarningComponent()}
      </div>
    );
  };

export default TODOComponent;