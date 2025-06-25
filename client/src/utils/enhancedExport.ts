
import type { InstitutionalTrade } from '@/types/trade';
import { calculatePnL } from './advancedAnalytics';
import { format } from 'date-fns';

export const exportEnhancedTradesToCSV = (trades: InstitutionalTrade[], filename: string = 'enhanced-trades-export.csv') => {
  const headers = [
    'Date',
    'Time',
    'Symbol',
    'Direction',
    'Entry Price',
    'Exit Price',
    'Stop Loss',
    'Take Profit',
    'Quantity',
    'P&L ($)',
    'R-Multiple',
    'Status',
    'Strategy',
    'Setup',
    'Emotional State',
    'Mistake',
    'Notes',
    'Win/Loss',
    'Session'
  ];

  const rows = trades.map(trade => {
    const pnl = calculatePnL(trade);
    const tradeDate = new Date(trade.created_at);
    const hour = tradeDate.getHours();
    
    // Determine trading session
    let session = 'Other';
    if (hour >= 2 && hour < 8) session = 'Asian';
    else if (hour >= 8 && hour < 16) session = 'London';
    else if (hour >= 16 && hour < 22) session = 'New York';
    
    // Extract strategy and setup from tags/notes
    const strategy = trade.tags?.[0] || '';
    const setup = trade.tags?.[1] || '';
    
    // Extract mistake from notes
    const noteParts = trade.notes?.split('\n') || [];
    const mistake = noteParts.find(part => part.startsWith('Mistake:'))?.replace('Mistake: ', '') || '';
    const cleanNotes = noteParts.filter(part => !part.startsWith('Mistake:') && !part.startsWith('Setup:')).join('; ');

    return [
      format(tradeDate, 'yyyy-MM-dd'),
      format(tradeDate, 'HH:mm:ss'),
      trade.symbol,
      trade.direction.toUpperCase(),
      trade.entry_price.toString(),
      trade.exit_price?.toString() || 'N/A',
      'N/A', // Stop loss not in current schema
      'N/A', // Take profit not in current schema
      trade.quantity.toString(),
      pnl.toFixed(2),
      'N/A', // R-multiple calculation would need stop loss
      trade.exit_price ? 'Closed' : 'Open',
      strategy,
      setup,
      trade.emotional_state || '',
      mistake,
      cleanNotes,
      trade.exit_price ? (pnl > 0 ? 'Win' : 'Loss') : 'Open',
      session
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  downloadCSV(csvContent, filename);
};

export const exportTradingJournal = (trades: InstitutionalTrade[], filename: string = 'trading-journal.csv') => {
  // Group trades by date for journal format
  const tradesByDate = trades.reduce((acc, trade) => {
    const date = format(new Date(trade.created_at), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(trade);
    return acc;
  }, {} as Record<string, InstitutionalTrade[]>);

  const headers = [
    'Date',
    'Total Trades',
    'Winning Trades',
    'Daily P&L',
    'Win Rate (%)',
    'Primary Strategy',
    'Emotional State',
    'Key Lessons',
    'Mistakes Made',
    'Tomorrow\'s Focus'
  ];

  const rows = Object.entries(tradesByDate).map(([date, dayTrades]) => {
    const closedTrades = dayTrades.filter(t => t.exit_price);
    const winningTrades = closedTrades.filter(t => calculatePnL(t) > 0);
    const dailyPnL = closedTrades.reduce((sum, t) => sum + calculatePnL(t), 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    
    const strategies = dayTrades.map(t => t.tags?.[0]).filter(Boolean);
    const primaryStrategy = strategies.length > 0 ? 
      strategies.reduce((acc, s) => ({ ...acc, [s]: (acc[s] || 0) + 1 }), {} as Record<string, number>)[0] : '';
    
    const emotions = dayTrades.map(t => t.emotional_state).filter(Boolean);
    const primaryEmotion = emotions.length > 0 ? emotions[0] : '';
    
    // Extract lessons and mistakes from notes
    const allNotes = dayTrades.map(t => t.notes).filter(Boolean).join(' ');
    const mistakes = allNotes.includes('Mistake:') ? 'Review notes for details' : 'None identified';

    return [
      date,
      dayTrades.length.toString(),
      winningTrades.length.toString(),
      dailyPnL.toFixed(2),
      winRate.toFixed(1),
      primaryStrategy,
      primaryEmotion,
      winRate > 60 ? 'Good execution day' : 'Review entry criteria',
      mistakes,
      winRate < 50 ? 'Focus on patience and discipline' : 'Continue current approach'
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  downloadCSV(csvContent, filename);
};

const downloadCSV = (csvContent: string, filename: string) => {
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
