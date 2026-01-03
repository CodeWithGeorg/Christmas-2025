
import React, { useState, useEffect, useMemo } from 'react';
import Snowfall from './components/Snowfall';
import ChristmasTree from './components/ChristmasTree';
import GiftCardModal from './components/GiftCardModal';
import Countdown from './components/Countdown';
import MusicPlayer from './components/MusicPlayer';
import { Analytics } from '@vercel/analytics/react';
import { track } from '@vercel/analytics';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isChristmasTime, setIsChristmasTime] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeMessage, setFadeMessage] = useState(true);
  
  // Personalization & Audio States
  const [senderName, setSenderName] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [userNameToShare, setUserNameToShare] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

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
    }

    // Check if Christmas has already arrived
    const targetDate = new Date('December 25, 2026 00:00:00').getTime();
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

  const startExperience = () => {
    setHasStarted(true);
    setIsMusicPlaying(true);
  };

  const getShareUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    if (userNameToShare.trim()) {
      return `${baseUrl}?name=${encodeURIComponent(userNameToShare.trim())}`;
    }
    return baseUrl;
  };


 const shareWebsite = async (platform?: string) => {
  const shareUrl = getShareUrl();
  const shareText = isChristmasTime 
    ? `🎄 Merry Christmas! A magical wish from ${userNameToShare || 'George'} ✨`
    : `🎄 Experience the magic of Christmas 2025 ${userNameToShare ? 'from ' + userNameToShare : ''} ✨`;

  // 🎉 Confetti effect
  const celebrate = () => {
    import('canvas-confetti').then(confetti => {
      confetti.default({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.7 }
      });
    });
  };

  if (platform === 'whatsapp') {
    track('share', {
  platform: 'whatsapp',
  name: userNameToShare || 'anonymous'
});

    celebrate();
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      '_blank'
    );
  }

  else if (platform === 'twitter') {
    track('share', {
  platform: 'whatsapp',
  name: userNameToShare || 'anonymous'
});

    celebrate();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  }

  else if (platform === 'facebook') {
    track('share', {
  platform: 'whatsapp',
  name: userNameToShare || 'anonymous'
});

    celebrate();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  }

  // ✅ INSTAGRAM (copy + notify + open app)
  else if (platform === 'instagram') {
    track('share', {
  platform: 'whatsapp',
  name: userNameToShare || 'anonymous'
});

    await navigator.clipboard.writeText(shareUrl);
    celebrate();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Open Instagram (mobile-friendly)
    window.open('https://www.instagram.com/', '_blank');
  }

  // 📋 Default = copy link
  else {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    celebrate();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }
};

 return (
    <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-4 selection:bg-red-500/30 overflow-x-hidden">
      {/* Background layer */}
      <Snowfall />
      
      {/* Entry Greeting Overlay */}
      {!hasStarted && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 to-transparent pointer-events-none" />
          
          <div className="mb-8 scale-150 drop-shadow-[0_0_30px_rgba(239,68,68,0.7)]">
            <i className="fas fa-snowflake text-7xl text-blue-400 animate-spin-slow"></i>
          </div>

          <h2 className="festive-font text-5xl md:text-8xl text-yellow-400 mb-6 drop-shadow-2xl">
            {senderName ? `Message from ${senderName}` : 'Christmas 2026 Magic'}
          </h2>

          <p className="text-xl md:text-3xl font-light italic text-blue-100 mb-12 max-w-2xl leading-relaxed">
            "The countdown to the most magical day of the year has begun."
          </p>

          <button 
            onClick={startExperience}
            className="group relative px-16 py-6 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-full text-2xl md:text-3xl font-bold shadow-[0_10px_40px_rgba(220,38,38,0.5)] hover:scale-110 transition-all festive-font border-b-8 border-red-950 active:translate-y-2 active:border-b-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            Enter the Wonderland <i className="fas fa-door-open ml-3"></i>
          </button>
        </div>
      )}

      {/* Main Content */}
      {hasStarted && (
        <>
          {isChristmasTime ? (
            /* CELEBRATION MODE */
            <div className="relative z-50 flex flex-col items-center justify-center text-center animate-celebration-reveal px-4 max-w-6xl w-full py-10">
              <div className="absolute inset-0 bg-red-900/20 backdrop-blur-[2px] -z-10 rounded-full scale-150 blur-3xl animate-pulse"></div>
              
              <div className="mb-8 transform hover:scale-110 transition-transform duration-1000 drop-shadow-[0_0_50px_rgba(253,224,71,0.5)]">
                <ChristmasTree />
              </div>

              <h2 className="festive-font text-6xl sm:text-8xl md:text-[10rem] leading-none mb-4 animate-glow-text">
                Merry Christmas
              </h2>
              
              <p className="text-yellow-400 font-black tracking-[0.5em] text-sm md:text-2xl mt-4 opacity-90 uppercase animate-bounce">
                The Magic of 2026 is Here
              </p>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full animate-fade-in-delayed">
                {/* Music Control Widget */}
                <MusicPlayer isPlaying={isMusicPlaying} setIsPlaying={setIsMusicPlaying} showControls={true} />

                {/* Gift Card section */}
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center">
                   <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <i className="fas fa-gift text-3xl"></i>
                   </div>
                   <h3 className="text-2xl font-bold mb-4">Personal Wish</h3>
                   <p className="text-white/60 mb-8 text-sm italic">Generate a unique AI-powered gift card to share with someone special.</p>
                   <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-5 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl text-xl font-bold hover:scale-105 transition-all shadow-xl"
                  >
                    Create Magic Card
                  </button>
                </div>

                {/* Share Joy section */}
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center">
                   <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <i className="fas fa-share-nodes text-3xl text-red-900"></i>
                   </div>
                   <h3 className="text-2xl font-bold mb-4">Spread The Joy</h3>
                   <p className="text-white/60 mb-6 text-sm italic">Send your personalized wonderland link to friends.</p>
                   
                   <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={userNameToShare}
                    onChange={(e) => setUserNameToShare(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 mb-4 text-center outline-none focus:ring-2 focus:ring-yellow-500"
                  />

                  <div className="flex gap-4">
                    <button onClick={() => shareWebsite('whatsapp')} className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 transition-all"><i className="fab fa-whatsapp"></i></button>
                    <button onClick={() => shareWebsite('facebook')} className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-all"><i className="fab fa-facebook"></i></button>
                    <button onClick={() => shareWebsite()} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:scale-110 transition-all"><i className="fas fa-link"></i></button>
                  </div>
                </div>
              </div>
              
              <footer className="mt-20 text-white/40 text-[10px] uppercase tracking-[0.5em] font-bold">
                Magical Christmas 2026 • George Edition
              </footer>
            </div>
          ) : (
            /* COUNTDOWN MODE */
            <main className="relative flex flex-col items-center text-center max-w-4xl animate-fade-in z-10 w-full py-12 md:py-20">
              
              {/* Headless music player for background audio */}
              <MusicPlayer isPlaying={isMusicPlaying} setIsPlaying={setIsMusicPlaying} showControls={false} />

              <div className="mb-12 group">
                <p className="text-red-500 font-bold tracking-[0.5em] text-xs md:text-sm uppercase mb-4 animate-pulse">Waiting for the miracle</p>
                <h1 className="festive-font text-6xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-blue-200 via-white to-blue-300 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] inline-block transform transition-transform duration-500 px-2 leading-tight">
                  Christmas 2026
                </h1>
              </div>

              <div className="my-8 scale-90 sm:scale-110 md:scale-150 transform transition-all">
                <Countdown onComplete={handleCountdownComplete} />
              </div>

              <div className={`mt-16 md:mt-24 transition-all duration-1000 ${fadeMessage ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-lg md:text-2xl font-light italic text-blue-100 max-w-lg mx-auto leading-relaxed border-t border-b border-white/5 py-8 px-4">
                  "{festiveMessages[currentMessageIndex]}"
                </p>
              </div>

              <footer className="fixed bottom-10 left-0 right-0 text-white/20 text-[10px] md:text-[12px] uppercase tracking-[0.6em] font-bold">
                George • 2026 Winter Wonderland
              </footer>
            </main>
          )}

          <GiftCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
      )}

      {/* Toast Notification */}
      <div className={`fixed top-6 md:top-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-black px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl shadow-2xl transition-all duration-500 z-[120] flex items-center border-b-4 border-yellow-700 w-[90%] sm:w-auto justify-center ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20 pointer-events-none'}`}>
        <i className="fas fa-sparkles mr-3 text-lg md:text-xl animate-spin"></i> Magic Link Copied!
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes celebration-reveal {
          from { opacity: 0; transform: scale(0.8) translateY(50px); filter: blur(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes glow-text {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.2); color: #fff; }
          50% { text-shadow: 0 0 50px rgba(253, 224, 71, 0.8), 0 0 80px rgba(239, 68, 68, 0.6); color: #fde047; }
        }
        .animate-fade-in { animation: fade-in 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-celebration-reveal { animation: celebration-reveal 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-glow-text { animation: glow-text 4s infinite ease-in-out; }
        .animate-fade-in-delayed { opacity: 0; animation: fade-in 1.5s 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
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
      <Analytics />
    </div>
  );
};

export default App;
