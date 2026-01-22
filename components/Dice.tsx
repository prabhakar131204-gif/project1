
import React from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRoll: () => void;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRoll, disabled }) => {
  const dots = {
    1: [<div key="1" className="dot self-center m-auto" />],
    2: [<div key="1" className="dot" />, <div key="2" className="dot self-end ml-auto" />],
    3: [<div key="1" className="dot" />, <div key="2" className="dot self-center m-auto" />, <div key="3" className="dot self-end ml-auto" />],
    4: [<div key="1" className="dot" />, <div key="2" className="dot" />, <div key="3" className="dot mt-auto" />, <div key="4" className="dot mt-auto" />],
    5: [<div key="1" className="dot" />, <div key="2" className="dot" />, <div key="3" className="dot m-auto" />, <div key="4" className="dot mt-auto" />, <div key="5" className="dot mt-auto" />],
    6: [<div key="1" className="dot" />, <div key="2" className="dot" />, <div key="3" className="dot my-auto" />, <div key="4" className="dot my-auto" />, <div key="5" className="dot mt-auto" />, <div key="6" className="dot mt-auto" />],
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="scene" onClick={!disabled && !isRolling ? onRoll : undefined}>
        <div className={`cube ${isRolling ? 'is-rolling' : `show-${value}`}`}>
          <div className="cube__face face-1 flex justify-center items-center">{dots[1]}</div>
          <div className="cube__face face-2 grid grid-cols-2">{dots[2]}</div>
          <div className="cube__face face-3 grid grid-cols-2">{dots[3]}</div>
          <div className="cube__face face-4 grid grid-cols-2">{dots[4]}</div>
          <div className="cube__face face-5 grid grid-cols-2">{dots[5]}</div>
          <div className="cube__face face-6 grid grid-cols-2">{dots[6]}</div>
        </div>
      </div>
      <button
        onClick={onRoll}
        disabled={disabled || isRolling}
        className={`
          px-8 py-3 bg-amber-500 text-slate-900 font-black rounded-full shadow-lg transform transition-all
          ${disabled ? 'opacity-50' : 'hover:scale-110 active:scale-95 hover:bg-amber-400'}
          tracking-widest uppercase text-sm
        `}
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
};

export default Dice;
