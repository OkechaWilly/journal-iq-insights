
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveWrapperProps {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
  tablet?: React.ReactNode;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  mobile,
  desktop,
  tablet
}) => {
  const isMobile = useIsMobile();
  
  // For now, we'll use a simple mobile/desktop split
  // In a production app, you might want more granular breakpoint detection
  if (isMobile) {
    return <>{mobile}</>;
  }
  
  return <>{desktop}</>;
};
