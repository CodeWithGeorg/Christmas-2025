
import React, { useState, useEffect, useMemo } from 'react';
import Snowfall from './components/Snowfall';
import ChristmasTree from './components/ChristmasTree';
import GiftCardModal from './components/GiftCardModal';
import Countdown from './components/Countdown';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isChristmasTime, setIsChristmasTime] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeMessage, setFadeMessage] = useState(true);
  
  // Personalization states
  const [senderName, setSenderName] = useState<string | null>(null);
  const [showEntryOverlay, setShowEntryOverlay] = useState(false);
  const [userNameToShare, setUserNameToShare] = useState('');

  const festiveMessages = useMemo(() => [
    "The spirit of Christmas is the spirit of love and of generosity and of goodness.",
    "Christmas isn't just a season. It's a feeling that lives in our hearts.",
    "The best gifts are the ones we share with the people we love.",
    "Christmas waves a magic wand over the world, making everything softer and more beautiful.",
    "May the miracle of Christmas fill your heart with warmth and love.",
    "Gifts of time and love are the basic ingredients of a truly merry Christmas.",
    "Peace on earth will come to stay, when we live Christmas every day.",
    "Every snowflake is a kiss from heaven during this magical season."
  ], []);

  useEffect(() => {
    // Check for personalization in URL
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get('name');
    if (nameFromUrl) {
      setSenderName(nameFromUrl);
      setShowEntryOverlay(true);
    }

    // Immediate check on mount for Christmas arrival
    const targetDate = new Date('December 25, 2025 00:00:00').getTime();
    if (Date.now() >= targetDate) {
      setIsChristmasTime(true);
    }

    // Message rotation effect
    const interval = setInterval(() => {
      setFadeMessage(false);
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % festiveMessages.length);
        setFadeMessage(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [festiveMessages]);

  const handleCountdownComplete = () => {
    setIsChristmasTime(true);
  };

  const getShareUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    if (userNameToShare.trim()) {
      return `${baseUrl}?name=${encodeURIComponent(userNameToShare.trim())}`;
    }
    return baseUrl;
  };

  const shareWebsite = (platform?: string) => {
    const shareUrl = getShareUrl();
    const shareText = isChristmasTime 
      ? `It's Christmas Time! 🎄 Celebrate with a magical wish from ${userNameToShare || 'George'}` 
      : `Experience the magic of Christmas 2025! Check out this special wish ${userNameToShare ? 'from ' + userNameToShare : ''} 🎄✨`;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
      if (navigator.share) {
        navigator.share({ title: 'Christmas 2025 Magic', text: shareText, url: shareUrl }).catch(console.error);
      } else {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-4 selection:bg-red-500/30 overflow-x-hidden">
      {/* Background layer */}
      <Snowfall />
      
      {/* Control layer */}
      <MusicPlayer />

      {/* Entry Greeting Overlay */}
      {showEntryOverlay && senderName && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-6 animate-fade-in">
          <div className="mb-8 scale-150 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
            <i className="fas fa-envelope-open-text text-6xl text-red-500 animate-bounce"></i>
          </div>
          <h2 className="festive-font text-5xl md:text-8xl text-yellow-400 mb-4">A Magical Message</h2>
          <p className="text-2xl md:text-4xl font-light italic text-blue-100 mb-12">
            Waiting for you, from <span className="text-red-500 font-bold underline decoration-yellow-500/30 underline-offset-8">{senderName}</span>
          </p>
          <button 
            onClick={() => setShowEntryOverlay(false)}
            className="px-12 py-5 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-full text-2xl font-bold shadow-2xl hover:scale-110 transition-transform festive-font border-b-4 border-red-950"
          >
            Open Your Magic Wish <i className="fas fa-sparkles ml-2"></i>
          </button>
        </div>
      )}

      {/* Celebration Mode Overlay */}
      {isChristmasTime ? (
        <div className="relative z-50 flex flex-col items-center justify-center text-center animate-celebration-reveal px-4">
          <div className="absolute inset-0 bg-red-900/20 backdrop-blur-[2px] -z-10 rounded-full scale-150 blur-3xl animate-pulse"></div>
          
          <div className="mb-12 transform hover:scale-110 transition-transform duration-1000 drop-shadow-[0_0_50px_rgba(253,224,71,0.5)]">
            <ChristmasTree />
          </div>

          <h2 className="festive-font text-6xl sm:text-8xl md:text-[12rem] leading-none mb-4 animate-glow-text transition-all duration-1000">
            It's Christmas Time
          </h2>
          
          <p className="text-yellow-400 font-black tracking-[0.5em] text-sm md:text-2xl mt-8 opacity-90 uppercase animate-bounce">
            The Magic Has Arrived
          </p>

          <div className="mt-16 flex flex-col items-center space-y-8 animate-fade-in-delayed">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="px-12 py-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-red-900 rounded-full text-2xl font-black shadow-[0_0_30px_rgba(234,179,8,0.5)] transform hover:scale-110 transition-all festive-font border-b-4 border-yellow-800"
            >
              Share The Joy <i className="fas fa-sparkles ml-2"></i>
            </button>
            
            <div className="flex space-x-6">
               <button onClick={() => shareWebsite('whatsapp')} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:scale-125 transition-all backdrop-blur-md">
                <i className="fab fa-whatsapp text-xl"></i>
              </button>
              <button onClick={() => shareWebsite('instagram')} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:scale-125 transition-all backdrop-blur-md">
                <i className="fab fa-instagram text-xl"></i>
              </button>
            </div>
          </div>
          
          <footer className="fixed bottom-10 left-0 right-0 text-white/40 text-[10px] uppercase tracking-[0.5em] font-bold">
            Magical Christmas 2025 • Designed by George
          </footer>
        </div>
      ) : (
        /* Regular Countdown Mode */
        <main className="relative flex flex-col items-center text-center max-w-4xl animate-fade-in z-10 w-full py-12 md:py-20 transition-all duration-1000">
          
          {/* Title Section */}
          <div className="mb-6 md:mb-8 group">
            <h1 className="festive-font text-5xl sm:text-7xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-red-600 to-red-900 drop-shadow-[0_10px_20px_rgba(239,68,68,0.6)] animate-bounce inline-block transform group-hover:scale-110 transition-transform duration-500 px-2">
              Merry Christmas 2025
            </h1>
            <p className="text-yellow-400 font-black tracking-[0.2em] md:tracking-[0.4em] text-[10px] sm:text-xs md:text-lg mt-2 md:mt-4 opacity-90 uppercase bg-black/20 backdrop-blur-md px-3 md:px-4 py-1 rounded-full inline-block">
              A Winter Wonderland Experience
            </p>
          </div>

          {/* Countdown Section */}
          <div className="my-4 md:my-6 scale-75 sm:scale-90 md:scale-110 transform">
            <Countdown onComplete={handleCountdownComplete} />
          </div>

          {/* Tree Section */}
          <div className="transform hover:scale-110 transition-transform duration-1000 my-6 md:my-10 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-90 md:scale-100">
            <ChristmasTree />
          </div>

          {/* Action Card */}
          <div className="bg-white/5 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/20 mt-4 md:mt-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group max-w-xl w-full mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className={`transition-all duration-500 ${fadeMessage ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
              <p className="text-lg md:text-3xl font-light italic text-blue-50 mb-6 md:mb-10 leading-relaxed drop-shadow-sm px-2 min-h-[4.5rem] md:min-h-[6.5rem] flex items-center justify-center">
                "{festiveMessages[currentMessageIndex]}"
              </p>
            </div>

            <div className="relative z-10">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-7 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-full text-xl md:text-3xl font-bold shadow-2xl shadow-red-900/60 transform hover:scale-105 md:hover:scale-110 transition-all festive-font border-b-4 md:border-b-8 border-red-950 active:translate-y-2 active:border-b-0 ring-4 ring-red-500/20"
              >
                Get Your Gift Card <i className="fas fa-gift ml-2 md:ml-3"></i>
              </button>
            </div>
          </div>

          {/* Share Joy Section */}
          <div className="mt-12 md:mt-16 flex flex-col items-center bg-black/10 backdrop-blur-sm p-6 rounded-[2.5rem] border border-white/5 w-full max-w-md">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-yellow-400 font-black mb-4">Personalize Your Share Link</p>
            
            <div className="w-full px-2 mb-6">
              <input 
                type="text" 
                placeholder="Enter Your Name to Share" 
                value={userNameToShare}
                onChange={(e) => setUserNameToShare(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-center text-lg placeholder:text-white/20"
              />
            </div>

            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Send the Magic to Friends</p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <button onClick={() => shareWebsite('whatsapp')} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#25D366] flex items-center justify-center hover:scale-110 transition-all shadow-lg" title="Share on WhatsApp">
                <i className="fab fa-whatsapp text-xl md:text-2xl"></i>
              </button>
              <button onClick={() => shareWebsite('facebook')} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-all shadow-lg" title="Share on Facebook">
                <i className="fab fa-facebook text-xl md:text-2xl"></i>
              </button>
              <button onClick={() => shareWebsite('instagram')} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center hover:scale-110 transition-all shadow-lg" title="Share on Instagram">
                <i className="fab fa-instagram text-xl md:text-2xl"></i>
              </button>
              <button onClick={() => shareWebsite('twitter')} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#1DA1F2] flex items-center justify-center hover:scale-110 transition-all shadow-lg" title="Share on Twitter">
                <i className="fab fa-twitter text-xl md:text-2xl"></i>
              </button>
              <button onClick={() => shareWebsite()} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 flex items-center justify-center hover:scale-110 transition-all shadow-lg backdrop-blur-md border border-white/20" title="Copy Link">
                <i className="fas fa-link text-xl md:text-2xl"></i>
              </button>
            </div>
          </div>

          <footer className="text-white/30 text-[10px] md:text-[12px] mt-16 md:mt-20 uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold">
            Designed by George for a Magical 2025
          </footer>
        </main>
      )}

      {/* Modal */}
      <GiftCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Toast Notification */}
      <div className={`fixed top-6 md:top-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-black px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl shadow-2xl transition-all duration-500 z-[120] flex items-center border-b-4 border-yellow-700 w-[90%] sm:w-auto justify-center ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20 pointer-events-none'}`}>
        <i className="fas fa-sparkles mr-3 text-lg md:text-xl animate-spin"></i> Magic Link Copied!
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes celebration-reveal {
          from { opacity: 0; transform: scale(0.5) rotate(-10deg); filter: blur(20px); }
          to { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
        }
        @keyframes glow-text {
          0% { text-shadow: 0 0 20px rgba(253, 224, 71, 0.2); color: #fde047; }
          50% { text-shadow: 0 0 50px rgba(253, 224, 71, 0.8), 0 0 100px rgba(239, 68, 68, 0.5); color: #ffffff; }
          100% { text-shadow: 0 0 20px rgba(253, 224, 71, 0.2); color: #fde047; }
        }
        @keyframes fade-in-delayed {
          0% { opacity: 0; }
          80% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-celebration-reveal {
          animation: celebration-reveal 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-glow-text {
          animation: glow-text 3s infinite ease-in-out;
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 4s forwards;
        }
        input[type=range] {
          -webkit-appearance: none;
          background: transparent;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #eab308;
          cursor: pointer;
          margin-top: -7px;
          box-shadow: 0 0 5px rgba(0,0,0,0.3);
          border: 2px solid white;
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }
      `}} />
    </div>
  );
};

export default App;
