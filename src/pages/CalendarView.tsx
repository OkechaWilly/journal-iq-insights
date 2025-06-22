
import React from 'react';
import { Layout } from '@/components/Layout';
import { TradingCalendar } from '@/components/calendar/TradingCalendar';

const CalendarView = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Trading Calendar</h2>
          <p className="text-slate-400">Visual overview of your trading activity by date</p>
        </div>
        
        <TradingCalendar />
      </div>
    </Layout>
  );
};

export default CalendarView;
