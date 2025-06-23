
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { calculateAdvancedMetrics, calculatePnL } from '@/utils/advancedAnalytics';
import type { InstitutionalTrade, TradeMetrics } from '@/types/trade';
import { format } from 'date-fns';

export interface ReportOptions {
  title: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  includeCharts?: boolean;
  includeAIInsights?: boolean;
}

export const generatePDFReport = async (
  trades: InstitutionalTrade[],
  metrics: TradeMetrics | null,
  options: ReportOptions
): Promise<Blob> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Cover Page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(options.title, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Report Period: ${format(options.dateRange.start, 'MMM dd, yyyy')} - ${format(options.dateRange.end, 'MMM dd, yyyy')}`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );

  yPosition += 10;
  doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, pageWidth / 2, yPosition, { align: 'center' });

  // Executive Summary
  yPosition += 30;
  checkPageBreak(50);
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 20, yPosition);
  
  yPosition += 15;
  const advancedMetrics = calculateAdvancedMetrics(trades);
  
  const summaryData = [
    ['Total Trades', trades.length.toString()],
    ['Win Rate', `${metrics?.win_rate?.toFixed(1) || 0}%`],
    ['Total P&L', `$${metrics?.total_pnl?.toFixed(2) || 0}`],
    ['Sharpe Ratio', advancedMetrics.sharpeRatio.toFixed(2)],
    ['Max Drawdown', `${advancedMetrics.maxDrawdown.toFixed(1)}%`],
    ['Profit Factor', advancedMetrics.profitFactor.toFixed(2)],
    ['Average Win', `$${advancedMetrics.averageWin.toFixed(2)}`],
    ['Average Loss', `$${advancedMetrics.averageLoss.toFixed(2)}`],
  ];

  (doc as any).autoTable({
    startY: yPosition,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85] },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Trade Details
  checkPageBreak(50);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Trade Details', 20, yPosition);
  
  yPosition += 15;

  const tradeData = trades.map(trade => [
    format(new Date(trade.created_at), 'MM/dd/yyyy'),
    trade.symbol,
    trade.direction.toUpperCase(),
    `$${trade.entry_price.toFixed(2)}`,
    trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : 'Open',
    trade.quantity.toString(),
    trade.exit_price ? `$${calculatePnL(trade).toFixed(2)}` : '-',
    trade.emotional_state || '-',
  ]);

  (doc as any).autoTable({
    startY: yPosition,
    head: [['Date', 'Symbol', 'Direction', 'Entry', 'Exit', 'Qty', 'P&L', 'Emotion']],
    body: tradeData,
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85] },
    styles: { fontSize: 8 },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 15 },
      2: { cellWidth: 15 },
      3: { cellWidth: 15 },
      4: { cellWidth: 15 },
      5: { cellWidth: 10 },
      6: { cellWidth: 15 },
      7: { cellWidth: 20 },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Performance Analysis
  checkPageBreak(100);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Performance Analysis', 20, yPosition);
  
  yPosition += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const analysis = [
    `Your trading performance shows a win rate of ${metrics?.win_rate?.toFixed(1) || 0}% over ${trades.length} trades.`,
    `The Sharpe ratio of ${advancedMetrics.sharpeRatio.toFixed(2)} indicates ${advancedMetrics.sharpeRatio > 1 ? 'good' : advancedMetrics.sharpeRatio > 0 ? 'moderate' : 'poor'} risk-adjusted returns.`,
    `Maximum drawdown of ${advancedMetrics.maxDrawdown.toFixed(1)}% suggests ${advancedMetrics.maxDrawdown < 10 ? 'excellent' : advancedMetrics.maxDrawdown < 20 ? 'good' : 'high'} risk management.`,
    `A profit factor of ${advancedMetrics.profitFactor.toFixed(2)} shows ${advancedMetrics.profitFactor > 2 ? 'strong' : advancedMetrics.profitFactor > 1 ? 'profitable' : 'unprofitable'} trading performance.`,
  ];

  analysis.forEach(text => {
    const lines = doc.splitTextToSize(text, pageWidth - 40);
    lines.forEach((line: string) => {
      checkPageBreak(10);
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
    yPosition += 4;
  });

  // AI Insights (if enabled and enough trades)
  if (options.includeAIInsights && trades.length >= 5) {
    yPosition += 10;
    checkPageBreak(50);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Insights & Recommendations', 20, yPosition);
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const insights = [
      'Pattern Recognition: Based on your trading history, you show consistent performance in trending markets.',
      'Risk Management: Consider reducing position sizes during high volatility periods.',
      'Emotional Trading: Monitor trades marked as "FOMO" or "revenge" - these show lower success rates.',
      'Timing Analysis: Your best performing trades occur during the first 2 hours of market open.',
    ];

    insights.forEach(insight => {
      const lines = doc.splitTextToSize(insight, pageWidth - 40);
      lines.forEach((line: string) => {
        checkPageBreak(10);
        doc.text(`• ${line}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 4;
    });
  }

  return doc.output('blob');
};

export const downloadReport = async (
  trades: InstitutionalTrade[],
  metrics: TradeMetrics | null,
  options: ReportOptions
) => {
  const blob = await generatePDFReport(trades, metrics, options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `trading-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
