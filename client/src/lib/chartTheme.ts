// Chart theme configuration for Recharts
export const getChartTheme = (isDark: boolean) => {
  return {
    grid: {
      stroke: isDark ? '#374151' : '#E5E7EB',
      strokeWidth: 1,
    },
    axis: {
      tick: {
        fill: isDark ? '#9CA3AF' : '#6B7280',
        fontSize: 12,
      },
      axisLine: {
        stroke: isDark ? '#374151' : '#E5E7EB',
        strokeWidth: 1,
      },
      tickLine: {
        stroke: isDark ? '#374151' : '#E5E7EB',
        strokeWidth: 1,
      },
    },
    tooltip: {
      contentStyle: {
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
        borderRadius: '8px',
        color: isDark ? '#F9FAFB' : '#111827',
        boxShadow: isDark 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      labelStyle: {
        color: isDark ? '#F9FAFB' : '#111827',
        fontWeight: 'bold',
      },
    },
    legend: {
      iconType: 'circle' as const,
      wrapperStyle: {
        color: isDark ? '#F9FAFB' : '#111827',
        fontSize: '14px',
      },
    },
    colors: {
      primary: isDark ? '#6366F1' : '#4F46E5',
      success: isDark ? '#10B981' : '#059669',
      danger: isDark ? '#EF4444' : '#DC2626',
      warning: isDark ? '#F59E0B' : '#D97706',
      info: isDark ? '#3B82F6' : '#2563EB',
      muted: isDark ? '#64748B' : '#6B7280',
      gradient: {
        profit: isDark 
          ? ['#10B981', '#059669'] 
          : ['#059669', '#047857'],
        loss: isDark 
          ? ['#EF4444', '#DC2626'] 
          : ['#DC2626', '#B91C1C'],
        volume: isDark 
          ? ['#6366F1', '#4F46E5'] 
          : ['#4F46E5', '#4338CA'],
      }
    },
  };
};

// Custom Recharts theme components
export const chartDefaults = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  strokeWidth: 2,
  fillOpacity: 0.8,
  activeDot: { r: 6 },
};

// Chart color palette for different data series
export const getChartColors = (isDark: boolean) => [
  isDark ? '#6366F1' : '#4F46E5', // Primary
  isDark ? '#10B981' : '#059669', // Success
  isDark ? '#EF4444' : '#DC2626', // Danger
  isDark ? '#F59E0B' : '#D97706', // Warning
  isDark ? '#3B82F6' : '#2563EB', // Info
  isDark ? '#8B5CF6' : '#7C3AED', // Purple
  isDark ? '#06B6D4' : '#0891B2', // Cyan
  isDark ? '#84CC16' : '#65A30D', // Lime
];

// Candlestick chart specific theme
export const getCandlestickTheme = (isDark: boolean) => ({
  up: {
    fill: isDark ? '#10B981' : '#059669',
    stroke: isDark ? '#10B981' : '#059669',
  },
  down: {
    fill: isDark ? '#EF4444' : '#DC2626',
    stroke: isDark ? '#EF4444' : '#DC2626',
  },
  wick: {
    stroke: isDark ? '#9CA3AF' : '#6B7280',
    strokeWidth: 1,
  },
});