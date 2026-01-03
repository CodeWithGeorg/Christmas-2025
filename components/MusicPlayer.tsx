
import React, { useRef, useEffect } from 'react';

interface MusicPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  showControls?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, setIsPlaying, showControls = true }) => {
  const [volume, setVolume] = React.useState(0.4);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioSrc = "./Merry-Christmas.mp4"; 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn("Autoplay prevented:", error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, setIsPlaying]);

  return (
    <div className={showControls ? "w-full" : "hidden"}>
      <audio 
        ref={audioRef} 
        loop 
        src={audioSrc} 
        onError={(e) => {
          const target = e.target as HTMLAudioElement;
          if (!target.src.includes('soundhelix')) {
             target.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
             if (isPlaying) target.play().catch(() => {});
          }
        }}
      />
      
      {showControls && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <i className="fas fa-music text-3xl"></i>
          </div>
          <h3 className="text-2xl font-bold mb-2">Festive Beats</h3>
          <p className="text-white/60 mb-8 text-sm italic">Christmas 2026 Atmosphere</p>
          
          <div className="flex items-center space-x-6 w-full px-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-xl active:scale-95 group"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-2xl group-hover:scale-110 transition-transform`}></i>
            </button>
            
            <div className="flex-1 flex flex-col space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Volume</span>
                <span className="text-[10px] text-yellow-400 font-bold">{Math.round(volume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-yellow-400 cursor-pointer h-1.5 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
