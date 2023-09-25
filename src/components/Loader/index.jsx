'use client';
import { CircleLoader } from 'react-spinners';

export default function ComponentLevelLoader({ text, color, loading, size }) {
  return (
    <span className="flex gap-1 items-center">
      {text}
      <CircleLoader color={color || 'rgb(124 58 237)'} loading={loading} size={size || 20} data-testid="loader" />
    </span>
  );
}
