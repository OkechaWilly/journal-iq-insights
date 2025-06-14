
import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

const Calendar = () => (
  <div className="max-w-xl mx-auto space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
      <CalendarIcon className="w-6 h-6 text-blue-500" />
      Calendar
    </h2>
    <p className="text-gray-600">View your trades and trading plans by date. Calendar integration coming soon.</p>
    <div className="bg-white p-6 rounded-lg shadow border text-center text-gray-400">Calendar widget placeholder</div>
  </div>
);

export default Calendar;
