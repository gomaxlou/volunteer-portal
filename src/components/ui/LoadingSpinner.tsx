'use client';

import React from 'react';
import { PulseLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  loading?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 10,
  color = '#48bb78',
  loading = true,
}) => {
  if (!loading) return null;

  return (
    <PulseLoader
      color={color}
      size={size}
      loading={loading}
      speedMultiplier={0.8}
    />
  );
};

export default LoadingSpinner;
