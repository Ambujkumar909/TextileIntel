import React, { useState, useCallback } from 'react';
import { fetchDailyBriefing } from './services/geminiService';
import { sendBriefingEmail } from './services/emailService';
import { AppStatus, PRIORITY_SOURCES } from './types.ts';
import type { BriefingData } from './types.ts';

import { Scheduler } from './components/Scheduler';
import { BriefingCard } from './components/BriefingCard';
import { EmailComposer } from './components/EmailComposer';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const handleRunAnalysis = useCallback(async (isAuto: boolean = false) => {
    setStatus(AppStatus.FETCHING);
    setError(null);
    setBriefingData(null);
    setNotification(null);

    try {
      setTimeout(() => setStatus(AppStatus.SUMMARIZING), 2500);

      const data = await fetchDailyBriefing();
      setBriefingData(data);
      setStatus(AppStatus.COMPLETED);

      // AUTOMATIC EMAIL TRIGGER
      if (isAuto) {
        setNotification({ msg: "Auto-sending report via secure cloud...", type: 'success' });
        try {
          const sent = await sendBriefingEmail(data);
          if (sent) {
            setNotification({ msg: "Report successfully auto-emailed to Ambuj.", type: 'success' });
          } else {
             setNotification({ msg: "Auto-email skipped (Missing configuration).", type: 'error' });
          }
        } catch (emailError) {
          setNotification({ msg: "Failed to auto-send email.", type: 'error' });
        }
      }

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  }, []);

  return (
    <div className="min-h-screen pb-20">
      
      {/* Premium Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-stone-900 rounded flex items-center justify-center shadow-lg">
              <span className="text-yellow-500 font-serif font-bold text-2xl">T</span>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight leading-none">Textile<span className="text-yellow-600">Intel</span></h1>
              <span className="text-yellow-600 text-[10px] uppercase tracking-[0.2em] font-medium block mt-1">Global Market Watch</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
             <span className="text-xs font-medium text-stone-500 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
               System Operational
             </span>
             <div className="h-8 w-[1px] bg-stone-200"></div>
             <div className="text-right">
                <p className="text-[10px] text-stone-400 uppercase">Current Date</p>
                <p className="text-xs font-serif font-bold text-stone-700">{new Date().toLocaleDateString()}</p>
             </div>
          </div>
        </div>
      </nav>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl border flex items-center gap-3 fade-in-up ${
          notification.type === 'success' ? 'bg-white border-emerald-100 text-stone-800' : 'bg-red-50 border-red-100 text-red-800'
        }`}>
           <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
           <p className="text-sm font-medium">{notification.msg}</p>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 pt-12">
        
        {/* Editorial Header Section */}
        <div className="mb-12 text-center fade-in-up">
          <span className="inline-block py-1 px-3 border border-yellow-600/30 rounded-full bg-yellow-50 text-yellow-800 text-[10px] font-bold tracking-widest uppercase mb-4">
            Daily Intelligence
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight">
            The World's Fabric & <br/><span className="italic text-stone-600">Financial Pulse</span>
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Automated deep-dive analysis into global supply chains, commodity pricing, and corporate movements in the textile sector.
          </p>
        </div>

        {/* Dynamic Source Ticker */}
        <div className="mb-12 overflow-hidden relative group rounded-xl border-y border-stone-200 bg-white/50 py-4 fade-in-up delay-100">
          <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10"></div>
          <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10"></div>
          
          <div className="flex gap-8 animate-none overflow-x-auto no-scrollbar scroll-smooth px-6 justify-center flex-wrap md:flex-nowrap">
             {PRIORITY_SOURCES.map((source, idx) => (
               <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-center gap-1 group/item cursor-default">
                 <span className="text-sm font-serif font-bold text-stone-400 group-hover/item:text-stone-900 transition-colors">{source.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto">
          <Scheduler status={status} onRunNow={handleRunAnalysis} />

          {/* Error State */}
          {status === AppStatus.ERROR && error && (
            <div className="bg-red-50 border border-red-100 text-red-800 p-6 rounded-xl mb-10 flex items-start gap-4 fade-in-up">
               <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               <div>
                 <h3 className="font-bold font-serif text-lg">Analysis Interrupted</h3>
                 <p className="text-sm opacity-80 mt-1">{error}</p>
               </div>
            </div>
          )}

          {/* Results Container */}
          {briefingData && status === AppStatus.COMPLETED && (
            <div className="space-y-8 pb-12">
              <BriefingCard data={briefingData} />
              <EmailComposer data={briefingData} />
            </div>
          )}
          
          {/* Empty State / Welcome */}
          {status === AppStatus.IDLE && !briefingData && (
            <div className="text-center py-20 opacity-60 fade-in-up delay-200">
               <div className="w-16 h-16 mx-auto mb-6 text-stone-300">
                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
               </div>
               <p className="text-stone-400 font-serif italic text-lg">"Knowledge is the fabric of success."</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;