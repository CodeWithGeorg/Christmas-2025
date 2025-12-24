
import React, { useState, useRef, useEffect } from 'react';
import Snowfall from './components/Snowfall';
import ChristmasTree from './components/ChristmasTree';
import GiftCardModal from './components/GiftCardModal';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showToast, setShowToast] = useState(false);

  // Background music handling
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      if (isPlaying) {
        audioRef.current.play().catch(err => {
            console.log("Auto-play prevented by browser policy", err);
            setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const shareWebsite = () => {
    const shareUrl = window.location.href;
    const shareText = "Experience the magic of Christmas 2025! Generate your own AI gift card here 🎄✨";
    
    if (navigator.share) {
      navigator.share({
        title: 'Christmas 2025 Magic',
        text: shareText,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-4">
      <Snowfall />

      {/* Music Control - Fixed Top Right */}
      <button 
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-40 bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30 transition-all duration-300"
      >
        <i className={`fas ${isPlaying ? 'fa-volume-up' : 'fa-volume-mute'} text-2xl text-red-400`}></i>
      </button>

      {/* Main Content Container */}
      <main className="flex flex-col items-center text-center max-w-2xl animate-fade-in duration-1000">
        
        {/* Title */}
        <h1 className="festive-font text-6xl md:text-8xl text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)] mb-8 animate-bounce">
          Merry Christmas 2025
        </h1>

        <ChristmasTree />

        {/* Festive Message */}
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 mb-8 shadow-2xl">
          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-blue-100">
            "The magic of Christmas is not in the presents, <br className="hidden md:block" />
            but in His presence and the love we share."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-full text-2xl font-bold shadow-lg shadow-red-900/40 transform hover:scale-105 transition-all festive-font border-b-4 border-red-900 active:border-b-0 active:translate-y-1"
          >
            Get My Gift Card <i className="fas fa-gift ml-2"></i>
          </button>

          <button 
            onClick={shareWebsite}
            className="px-10 py-5 bg-green-700 hover:bg-green-800 text-white rounded-full text-2xl font-bold shadow-lg shadow-green-900/40 transform hover:scale-105 transition-all festive-font border-b-4 border-green-950 active:border-b-0 active:translate-y-1"
          >
            Spread the Joy <i className="fas fa-share-alt ml-2"></i>
          </button>
        </div>

        {/* Footer info */}
        <footer className="text-white/40 text-sm mt-8">
          Made with festive magic for the year 2025
        </footer>
      </main>

      {/* Modal for Gift Card Generation */}
      <GiftCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Hidden Audio Source */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder, in a real scenario use an actual Christmas track URL
      />
      {/* 
        Note: For a real "We Wish You A Merry Christmas" track, you'd link to a public domain mp3 file.
        Using a standard creative commons holiday music track link would be better for actual production.
      */}

      {/* Toast Notification for Share */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce z-50">
          Link copied to clipboard! 🎄
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default App;
