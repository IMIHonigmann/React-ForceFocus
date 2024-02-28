import React from 'react';

const WarningComponent = (/* { todoList, setTodoList, setShowWarning } */) => {
    const modalStyle = {
        borderStyle: 'solid',
        borderRadius: 20,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '40px',
        backgroundColor: '#fff',
        transitionDuration: '0.4s',
    };
    
    return (
        <>
            <p style={modalStyle}>
                Warning: This process cannot be undone
                <p>
                    <button
                    // onClick={setTodoList([])}
                    >
                        DELETE
                    </button>
                    <button>
                        CANCEL
                    </button>
                </p>
                
            </p>
        </>
    );
};

export default WarningComponent;
