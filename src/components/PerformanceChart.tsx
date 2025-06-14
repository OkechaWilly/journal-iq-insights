
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jan', pnl: 245 },
  { date: 'Feb', pnl: 412 },
  { date: 'Mar', pnl: 387 },
  { date: 'Apr', pnl: 598 },
  { date: 'May', pnl: 456 },
  { date: 'Jun', pnl: 789 },
  { date: 'Jul', pnl: 923 },
  { date: 'Aug', pnl: 1123 },
  { date: 'Sep', pnl: 1456 },
  { date: 'Oct', pnl: 1789 },
  { date: 'Nov', pnl: 2234 },
  { date: 'Dec', pnl: 2847 },
];

export const PerformanceChart = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Performance Chart</CardTitle>
        <p className="text-sm text-gray-600">Monthly P&L progression</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              className="text-gray-600"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              className="text-gray-600"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'P&L']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="pnl" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
