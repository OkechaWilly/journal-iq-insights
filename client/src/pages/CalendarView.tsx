
import React from 'react';
import { Layout } from '@/components/Layout';
import { ImprovedTradingCalendar } from '@/components/calendar/ImprovedTradingCalendar';

const CalendarView = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Trading Calendar</h2>
          <p className="text-slate-400">Visual overview of your trading activity with detailed insights</p>
        </div>
        
        <ImprovedTradingCalendar />
      </div>
    </Layout>
  );
};

export default CalendarView;
