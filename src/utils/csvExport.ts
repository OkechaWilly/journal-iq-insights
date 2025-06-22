
import type { InstitutionalTrade } from '@/types/trade';
import { calculatePnL } from './advancedAnalytics';

// Use InstitutionalTrade as Trade for consistency
type Trade = InstitutionalTrade;

export const exportTradesToCSV = (trades: Trade[], filename: string = 'trades-export.csv') => {
  const headers = [
    'Date',
    'Symbol',
    'Direction',
    'Entry Price',
    'Exit Price',
    'Quantity',
    'P&L',
    'Status',
    'Tags',
    'Emotional State',
    'Notes'
  ];

  const rows = trades.map(trade => [
    new Date(trade.created_at).toLocaleDateString(),
    trade.symbol,
    trade.direction.toUpperCase(),
    trade.entry_price.toString(),
    trade.exit_price?.toString() || 'N/A',
    trade.quantity.toString(),
    calculatePnL(trade).toFixed(2),
    trade.exit_price ? 'Closed' : 'Open',
    trade.tags?.join('; ') || '',
    trade.emotional_state || '',
    trade.notes || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportPerformanceReport = (
  trades: Trade[],
  monthlyData: any[],
  filename: string = 'performance-report.csv'
) => {
  const summaryHeaders = ['Metric', 'Value'];
  const totalPnL = trades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
  const closedTrades = trades.filter(trade => trade.exit_price);
  const winningTrades = closedTrades.filter(trade => calculatePnL(trade) > 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

  const summaryRows = [
    ['Total Trades', trades.length.toString()],
    ['Closed Trades', closedTrades.length.toString()],
    ['Total P&L', `$${totalPnL.toFixed(2)}`],
    ['Win Rate', `${winRate.toFixed(1)}%`],
    ['Winning Trades', winningTrades.length.toString()]
  ];

  const monthlyHeaders = ['Month', 'Total Trades', 'Winning Trades', 'Total P&L', 'Average P&L'];
  const monthlyRows = monthlyData.map(data => [
    data.month,
    data.total_trades.toString(),
    data.winning_trades.toString(),
    `$${data.total_pnl.toFixed(2)}`,
    `$${data.avg_pnl.toFixed(2)}`
  ]);

  const csvContent = [
    '=== PERFORMANCE SUMMARY ===',
    summaryHeaders.join(','),
    ...summaryRows.map(row => row.join(',')),
    '',
    '=== MONTHLY BREAKDOWN ===',
    monthlyHeaders.join(','),
    ...monthlyRows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
