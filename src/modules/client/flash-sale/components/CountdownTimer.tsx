"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate: string | Date;
  onComplete?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  onComplete,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate);
      const now = new Date();
      const difference = end.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) {
          onComplete();
        }
        return;
      }

      setIsExpired(false);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endDate, onComplete]);

  if (isExpired) {
    return (
      <div className={`text-gray-500 font-semibold ${className}`}>
        Đã kết thúc
      </div>
    );
  }

  // Kiểm tra nếu className chứa "text-white" thì dùng style cho header gradient
  const isInHeader = className.includes("text-white");
  
  return (
    <div className={`flex items-center gap-1 sm:gap-2 flex-wrap ${className}`}>
      <div className="flex items-center gap-0.5 sm:gap-1">
        <div className={`${isInHeader ? 'bg-white text-gray-900 border border-gray-300' : 'bg-gray-700 text-white'} px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 rounded-lg text-xs sm:text-sm font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center shadow-md`}>
          {String(timeLeft.days).padStart(2, "0")}
        </div>
        <span className={`text-[10px] sm:text-xs md:text-sm ${isInHeader ? 'text-gray-200' : 'text-gray-600'} hidden sm:inline`}>Ngày</span>
      </div>
      <span className={`${isInHeader ? 'text-gray-300' : 'text-gray-400'} text-xs sm:text-sm`}>:</span>
      <div className="flex items-center gap-0.5 sm:gap-1">
        <div className={`${isInHeader ? 'bg-white text-gray-900 border border-gray-300' : 'bg-gray-700 text-white'} px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 rounded-lg text-xs sm:text-sm font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center shadow-md`}>
          {String(timeLeft.hours).padStart(2, "0")}
        </div>
        <span className={`text-[10px] sm:text-xs md:text-sm ${isInHeader ? 'text-gray-200' : 'text-gray-600'} hidden sm:inline`}>Giờ</span>
      </div>
      <span className={`${isInHeader ? 'text-gray-300' : 'text-gray-400'} text-xs sm:text-sm`}>:</span>
      <div className="flex items-center gap-0.5 sm:gap-1">
        <div className={`${isInHeader ? 'bg-white text-gray-900 border border-gray-300' : 'bg-gray-700 text-white'} px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 rounded-lg text-xs sm:text-sm font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center shadow-md`}>
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <span className={`text-[10px] sm:text-xs md:text-sm ${isInHeader ? 'text-gray-200' : 'text-gray-600'} hidden sm:inline`}>Phút</span>
      </div>
      <span className={`${isInHeader ? 'text-gray-300' : 'text-gray-400'} text-xs sm:text-sm`}>:</span>
      <div className="flex items-center gap-0.5 sm:gap-1">
        <div className={`${isInHeader ? 'bg-white text-gray-900 border border-gray-300' : 'bg-gray-700 text-white'} px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 rounded-lg text-xs sm:text-sm font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center shadow-md`}>
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
        <span className={`text-[10px] sm:text-xs md:text-sm ${isInHeader ? 'text-gray-200' : 'text-gray-600'} hidden sm:inline`}>Giây</span>
      </div>
    </div>
  );
};

