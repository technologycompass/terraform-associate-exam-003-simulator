import React, { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  durationSeconds: number;
  onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ durationSeconds, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isUrgent = timeLeft < 60;

  return (
    <div className={`flex items-center gap-2 font-mono text-lg font-bold ${isUrgent ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
      <TimerIcon size={20} />
      <span>{formatTime(timeLeft)}</span>
      {isUrgent && <span className="text-sm font-bold">Time is low!</span>}
    </div>
  );
};