import React, { useEffect, useState, useRef } from 'react';
import { AppStatus } from '../types';

interface SchedulerProps {
  status: AppStatus;
  onRunNow: (isAuto: boolean) => void;
}

export const Scheduler: React.FC<SchedulerProps> = ({ status, onRunNow }) => {
  const [timeUntilRun, setTimeUntilRun] = useState<string>("");
  const hasTriggeredToday = useRef(false);

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      
      // Auto-Trigger Logic: Check if it's 8:00 AM (08:00 to 08:01)
      if (now.getHours() === 8 && now.getMinutes() === 0 && !hasTriggeredToday.current) {
        if (status === AppStatus.IDLE) {
          console.log("Auto-triggering scheduled task...");
          hasTriggeredToday.current = true;
          // Pass true to indicate this is an automatic run
          onRunNow(true);
        }
      }

      // Reset the trigger flag if it's a new day (e.g. 12:00 AM)
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        hasTriggeredToday.current = false;
      }

      // Visual Countdown Calculation
      const target = new Date();
      target.setHours(8, 0, 0, 0);
      if (now.getHours() >= 8) {
        target.setDate(target.getDate() + 1);
      }
      const diff = target.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilRun(`${hours}h ${minutes}m`);
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [status, onRunNow]);

  const isProcessing = status === AppStatus.FETCHING || status === AppStatus.SUMMARIZING;

  return (
    <div className="relative overflow-hidden bg-white/60 backdrop-blur-md border border-stone-200 rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 fade-in-up delay-100 group transition-all duration-500 hover:shadow-[0_8px_30px_rgb(180,155,104,0.1)]">
      {/* Decorative Gold Bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-yellow-600/20 group-hover:bg-yellow-600/40 transition-colors"></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-start gap-5">
          <div className="p-4 bg-stone-100 rounded-full border border-stone-200 text-stone-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl serif font-semibold text-stone-900">Automation Status</h3>
            <p className="text-stone-500 text-sm mt-1 leading-relaxed">
              System active. Next scheduled intelligence gathering in <span className="font-semibold text-yellow-700 font-mono bg-yellow-50 px-2 py-0.5 rounded">{timeUntilRun}</span>.
            </p>
            <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">*Browser must remain open</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
          {isProcessing && (
             <div className="flex items-center gap-2 text-yellow-700 text-xs font-semibold uppercase tracking-widest animate-pulse">
               <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               {status === AppStatus.FETCHING ? 'Aggregating Sources...' : 'Compiling Report...'}
             </div>
          )}
          
          <button
            onClick={() => onRunNow(false)}
            disabled={isProcessing}
            className={`
              relative overflow-hidden w-full md:w-auto px-8 py-3 rounded-lg font-medium text-sm transition-all duration-300 transform active:scale-95
              ${isProcessing 
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                : 'bg-stone-900 text-white hover:bg-black shadow-lg shadow-stone-900/10 hover:shadow-stone-900/20'
              }
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing' : 'Generate Briefing Now'}
              {!isProcessing && (
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};