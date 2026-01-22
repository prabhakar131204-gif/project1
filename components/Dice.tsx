
import React from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRoll: () => void;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRoll, disabled }) => {
  const renderDots = (num: number) => {
    switch (num) {
      case 1:
        return <div className="dot self-center m-auto" />;
      case 2:
        return <><div className="dot" /><div className="dot self-end ml-auto" /></>;
      case 3:
        return <><div className="dot" /><div className="dot self-center m-auto" /><div className="dot self-end ml-auto" /></>;
      case 4:
        return <><div className="dot" /><div className="dot" /><div className="dot mt-auto" /><div className="dot mt-auto" /></>;
      case 5:
        return <><div className="dot" /><div className="dot" /><div className="dot m-auto" /><div className="dot mt-auto" /><div className="dot mt-auto" /></>;
      case 6:
        return <><div className="dot" /><div className="dot" /><div className="dot my-auto" /><div className="dot my-auto" /><div className="dot mt-auto" /><div className="dot mt-auto" /></>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="scene" onClick={!disabled && !isRolling ? onRoll : undefined}>
        <div className={`cube ${isRolling ? 'is-rolling' : `show-${value}`}`}>
          <div className="cube__face face-1 flex justify-center items-center">{renderDots(1)}</div>
          <div className="cube__face face-2 grid grid-cols-2">{renderDots(2)}</div>
          <div className="cube__face face-3 grid grid-cols-2">{renderDots(3)}</div>
          <div className="cube__face face-4 grid grid-cols-2">{renderDots(4)}</div>
          <div className="cube__face face-5 grid grid-cols-2">{renderDots(5)}</div>
          <div className="cube__face face-6 grid grid-cols-2">{renderDots(6)}</div>
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
