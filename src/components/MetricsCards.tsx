
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';

const metrics = [
  {
    title: "Total P&L",
    value: "+$2,847.50",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Win Rate",
    value: "68.4%",
    change: "+3.2%",
    changeType: "positive",
    icon: Target,
  },
  {
    title: "Total Trades",
    value: "156",
    change: "+8 today",
    changeType: "neutral",
    icon: Calendar,
  },
  {
    title: "Avg. Win",
    value: "$124.30",
    change: "+$12.50",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    title: "Avg. Loss",
    value: "-$78.20",
    change: "-$5.10",
    changeType: "negative",
    icon: TrendingDown,
  },
];

export const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            <p className={`text-xs mt-1 ${
              metric.changeType === 'positive' ? 'text-green-600' :
              metric.changeType === 'negative' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {metric.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
