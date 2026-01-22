
import React, { useState, useCallback } from 'react';
import { GameTheme, Player, GameState } from './types';
import { THEMES, STANDARD_BOARD, PLAYER_COLORS, PLAYER_AVATARS } from './constants';
import Board from './components/Board';
import Dice from './components/Dice';
import { audioService } from './services/audioService';
import { ChevronLeft, Trophy, Users, Gamepad2 } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [theme, setTheme] = useState<GameTheme>(GameTheme.CLASSIC);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [lastMoveMsg, setLastMoveMsg] = useState('Welcome, adventurer!');
  const [winner, setWinner] = useState<Player | null>(null);

  const config = THEMES[theme];

  const initializePlayers = (count: number) => {
    const newPlayers: Player[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: `Hero ${i + 1}`,
      position: 1,
      color: PLAYER_COLORS[i],
      avatar: PLAYER_AVATARS[i]
    }));
    setPlayers(newPlayers);
    setGameState('PLAYING');
    setCurrentPlayerIndex(0);
    setWinner(null);
    setLastMoveMsg('The race begins! Roll the dice to start your journey.');
  };

  const handleRoll = async () => {
    if (isRolling || winner) return;

    setIsRolling(true);
    audioService.playDiceRoll();

    // Dice animation duration
    await new Promise(resolve => setTimeout(resolve, 1200));

    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);
    setIsRolling(false);

    movePlayer(roll);
  };

  const movePlayer = useCallback((steps: number) => {
    const currentPlayer = players[currentPlayerIndex];
    let newPos = currentPlayer.position + steps;

    if (newPos > 100) {
      setLastMoveMsg(`Wait! ${currentPlayer.name} needed exactly ${100 - currentPlayer.position} but rolled ${steps}.`);
      audioService.playMove();
      nextTurn();
      return;
    }

    setLastMoveMsg(`${currentPlayer.name} advances to square ${newPos}`);
    audioService.playMove();

    const special = STANDARD_BOARD.find(item => item.start === newPos);
    
    setTimeout(() => {
      if (special) {
        newPos = special.end;
        const isSnake = special.type === 'SNAKE';
        setLastMoveMsg(isSnake 
          ? `Ouch! A snake slithered ${currentPlayer.name} back to ${newPos}!` 
          : `Luck! ${currentPlayer.name} discovered a ladder to ${newPos}!`
        );
        audioService.playSpecial(isSnake);
      }

      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].position = newPos;
      setPlayers(updatedPlayers);

      if (newPos === 100) {
        setWinner(updatedPlayers[currentPlayerIndex]);
        setGameState('WINNER');
        return;
      }

      nextTurn();
    }, 800);

  }, [players, currentPlayerIndex]);

  const nextTurn = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  if (gameState === 'LOBBY') {
    return (
      <div className="min-h-screen bg-pattern relative overflow-hidden flex flex-col items-center justify-center p-6 bg-[#020617]">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 text-9xl opacity-20 floating select-none pointer-events-none">🐍</div>
        <div className="absolute bottom-40 right-10 text-9xl opacity-20 floating select-none pointer-events-none" style={{ animationDelay: '2s' }}>🪜</div>
        <div className="absolute top-1/2 left-1/4 text-6xl opacity-10 floating select-none pointer-events-none" style={{ animationDelay: '1s' }}><Gamepad2 className="w-24 h-24" /></div>

        <div className="z-10 max-w-5xl w-full flex flex-col items-center">
          <header className="mb-16 text-center">
            <h1 className="game-title text-7xl md:text-9xl font-black mb-4 select-none tracking-tight">MYTHIC</h1>
            <h2 className="text-xl md:text-2xl font-black text-amber-500 tracking-[0.6em] uppercase drop-shadow-lg font-cinzel">
              Snakes & Ladders
            </h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 w-full items-start">
            {/* Theme Selection */}
            <div className="glass-card rounded-[3rem] p-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                 <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
                 <h3 className="text-white text-xl font-black uppercase tracking-widest font-cinzel">Select Your Realm</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {Object.values(GameTheme).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`
                      relative group overflow-hidden h-40 rounded-3xl border-4 transition-all duration-500
                      ${theme === t ? 'border-amber-400 scale-105 shadow-[0_20px_40px_rgba(245,158,11,0.4)]' : 'border-white/5 opacity-40 hover:opacity-100'}
                    `}
                  >
                    <div className={`absolute inset-0 ${THEMES[t].bg} opacity-80`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
                      <span className="text-white font-black text-lg uppercase leading-tight font-cinzel">{THEMES[t].name}</span>
                      <div className={`h-1.5 bg-amber-500 mt-2 rounded-full transition-all duration-500 ${theme === t ? 'w-full' : 'w-0 group-hover:w-1/2'}`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Multiplayer Selection */}
            <div className="glass-card rounded-[3rem] p-10 flex flex-col items-center gap-8 shadow-2xl">
              <div className="text-center">
                <Users className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-amber-500 text-sm font-black uppercase tracking-[0.3em] mb-2 font-cinzel">Join Quest</h3>
                <p className="text-white/60 text-xs font-bold px-4">Minimum 2 players required for the journey.</p>
              </div>
              
              <div className="flex flex-col gap-4 w-full">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => initializePlayers(count)}
                    className="group relative h-20 w-full rounded-2xl bg-amber-500 hover:bg-amber-400 transition-all flex items-center justify-center overflow-hidden active:scale-95"
                  >
                    <span className="relative z-10 text-slate-950 font-black text-2xl uppercase tracking-widest font-cinzel">
                      {count} Players
                    </span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <footer className="absolute bottom-8 flex flex-col items-center gap-2">
           <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.8em]">
             Mythic Studios &bull; 2024
           </p>
        </footer>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${config.bg} flex flex-col items-center justify-start p-4 md:p-8 transition-all duration-1000 bg-pattern`}>
      <header className="w-full max-w-5xl flex justify-between items-center mb-8 bg-black/20 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5">
        <button 
          onClick={() => setGameState('LOBBY')}
          className="px-6 py-3 bg-white/5 text-white/50 rounded-2xl hover:text-white hover:bg-white/10 transition-all text-[11px] font-black uppercase tracking-widest border border-white/10 shadow-lg flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Lobby
        </button>
        <div className="text-center">
          <h1 className="game-title text-4xl md:text-5xl font-black select-none tracking-tighter">MYTHIC</h1>
          <p className="text-[11px] font-black text-amber-500 uppercase tracking-[0.4em] font-cinzel">{config.name}</p>
        </div>
        <div className="w-32 flex justify-end">
           <div className="bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-500/30">
              <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest whitespace-nowrap">Turn: {players[currentPlayerIndex]?.name}</span>
           </div>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-12 items-start">
        <div className="flex flex-col items-center gap-10">
          <Board 
            theme={theme} 
            players={players} 
            activePlayerId={currentPlayerIndex} 
          />
          <div className="w-full max-w-[600px] glass-card rounded-3xl p-8 border-l-8 border-amber-500 relative overflow-hidden">
             <p className="text-center text-white text-xl font-bold italic font-serif leading-relaxed">
              &quot;{lastMoveMsg}&quot;
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full sticky top-8">
          {/* Active Player */}
          <div className="glass-card rounded-[3rem] p-10 relative overflow-hidden">
             <div 
              className="absolute -top-20 -right-20 w-64 h-64 blur-[120px] opacity-40 transition-all duration-1000"
              style={{ backgroundColor: players[currentPlayerIndex]?.color }}
             />
             <h3 className="text-white/30 text-[10px] font-black uppercase mb-8 tracking-[0.3em] font-cinzel">Current Hero</h3>
             <div className="flex items-center gap-8">
                <div 
                  className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl border-4 border-white/20 transform transition-all duration-700 hover:rotate-12 hover:scale-110"
                  style={{ backgroundColor: players[currentPlayerIndex]?.color }}
                >
                  {players[currentPlayerIndex]?.avatar}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2 font-cinzel">{players[currentPlayerIndex]?.name}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-amber-500 text-slate-950 px-4 py-1 rounded-lg font-black text-xs uppercase shadow-lg">Square {players[currentPlayerIndex]?.position}</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Dice Area */}
          <div className="glass-card rounded-[3rem] p-12 flex flex-col items-center justify-center shadow-2xl border-2 border-white/10">
            <Dice 
              value={diceValue} 
              isRolling={isRolling} 
              onRoll={handleRoll}
              disabled={gameState === 'WINNER'}
            />
          </div>

          {/* Leaderboard */}
          <div className="bg-black/40 backdrop-blur rounded-[3rem] p-8 border border-white/5">
            <h3 className="text-white/20 text-[10px] font-black uppercase mb-6 tracking-widest font-cinzel">Standings</h3>
            <div className="space-y-4">
              {players.map((p, idx) => (
                <div 
                  key={p.id}
                  className={`
                    flex items-center justify-between p-5 rounded-2xl transition-all duration-700
                    ${idx === currentPlayerIndex ? 'bg-amber-500/10 border-2 border-amber-500 shadow-lg scale-105' : 'bg-white/5 border border-transparent opacity-50'}
                  `}
                >
                  <div className="flex items-center gap-5">
                    <span className="text-2xl">{p.avatar}</span>
                    <span className="text-white font-black tracking-tight text-lg font-cinzel">{p.name}</span>
                  </div>
                  <div className="bg-slate-900 px-5 py-2 rounded-2xl text-amber-500 font-black text-sm border border-white/10">
                    {p.position}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Winner Modal */}
      {gameState === 'WINNER' && winner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
          <div className="relative glass-card border-4 border-amber-500 rounded-[5rem] p-20 max-w-xl w-full text-center shadow-[0_0_150px_rgba(245,158,11,0.5)]">
            <Trophy className="w-32 h-32 text-amber-500 mx-auto mb-10" />
            <h1 className="game-title text-7xl font-black mb-6 italic font-cinzel leading-none">VICTORIOUS!</h1>
            <p className="text-white text-3xl font-black tracking-widest uppercase mb-10 font-cinzel">{winner.name}</p>
            <button
              onClick={() => setGameState('LOBBY')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-8 rounded-[2.5rem] transition-all uppercase tracking-[0.4em] text-xl font-cinzel"
            >
              Restart Quest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
