
import React, { useState, useEffect } from 'react';

interface CountdownProps {
  onComplete?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('December 25, 2026 00:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) onComplete();
        return true;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
      return false;
    };

    const isDone = calculateTimeLeft();
    if (isDone) return;

    const timer = setInterval(() => {
      const finished = calculateTimeLeft();
      if (finished) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const TimerBox = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center mx-3 md:mx-6 group">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:bg-red-500/30 transition-all duration-700"></div>
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 w-20 h-24 md:w-28 md:h-32 rounded-3xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105 group-hover:border-white/30">
          <span className="text-3xl md:text-5xl font-black text-white tabular-nums tracking-tighter drop-shadow-lg">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="text-[10px] md:text-xs mt-4 uppercase tracking-[0.4em] text-white/40 font-black group-hover:text-yellow-400/70 transition-colors">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center items-center py-10">
      <TimerBox value={timeLeft.days} label="Days" />
      <TimerBox value={timeLeft.hours} label="Hours" />
      <TimerBox value={timeLeft.minutes} label="Mins" />
      <TimerBox value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default Countdown;
