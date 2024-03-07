import React from "react";

const PomodoroComponent = ({ curPom, setCurPom}) => {
    const pomodoroAmount = 5;
    const maxSize = 1700;
    const cellSize = maxSize / pomodoroAmount;
    const biggerCellSize = cellSize * 2.5;
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${pomodoroAmount}, auto)`,
        placeItems: 'center',
        gap: 0
    };
    const spanStyles = {
        width: (maxSize - biggerCellSize) / (pomodoroAmount-1)
    };
    const curPomStyle = {
        width: biggerCellSize,
        backgroundColor: '#17280A',
    }

        return (
            <div style={gridStyle}>
                {Array.from({ length: pomodoroAmount }, (_, index) => (
                    <span key={index} className='pomodoroSpan' style={{...spanStyles, ...(index == curPom ? curPomStyle : {})}}
                    onClick={() => setCurPom(index)}>
                        {index+1}
                    </span>
                ))}
            </div>
        );
}

export default PomodoroComponent