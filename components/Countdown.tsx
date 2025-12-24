
import React, { useState, useEffect } from 'react';

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('December 25, 2025 00:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, []);

  const TimerBox = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="bg-red-900/40 backdrop-blur-md border border-yellow-500/30 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
        <span className="text-2xl md:text-3xl font-bold text-yellow-400 tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm mt-2 uppercase tracking-widest text-white/70 font-bold">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center items-center py-6 animate-pulse">
      <TimerBox value={timeLeft.days} label="Days" />
      <TimerBox value={timeLeft.hours} label="Hours" />
      <TimerBox value={timeLeft.minutes} label="Mins" />
      <TimerBox value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default Countdown;
