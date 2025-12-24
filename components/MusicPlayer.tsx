
import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-40 bg-white/10 backdrop-blur-xl border border-white/20 p-2 sm:p-3 md:p-4 rounded-2xl md:rounded-3xl flex items-center space-x-2 sm:space-x-4 shadow-2xl transition-all duration-500 hover:bg-white/15">
      <audio 
        ref={audioRef} 
        loop 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
      />
      
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg active:scale-90"
      >
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-sm md:text-base`}></i>
      </button>

      <div className="hidden md:flex flex-col space-y-1">
        <span className="text-[10px] uppercase tracking-tighter text-white/60 font-bold">Volume</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20 md:w-24 accent-yellow-400 cursor-pointer h-1 rounded-lg"
        />
      </div>

      <div className="pr-1 md:pr-2">
        <p className="text-[10px] md:text-xs font-bold text-white/90 truncate max-w-[80px] sm:max-w-none">Festive Beats</p>
        <p className="text-[8px] md:text-[10px] text-white/50">Merry Xmas '25</p>
      </div>
    </div>
  );
};

export default MusicPlayer;
