import React from 'react';

export const CakeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-5 space-y-4">
        <div className="h-6 w-32 skeleton-shimmer rounded-lg" />
        <div className="space-y-2">
          <div className="h-4 w-full skeleton-shimmer rounded" />
          <div className="h-4 w-3/4 skeleton-shimmer rounded" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-7 w-24 skeleton-shimmer rounded-lg" />
          <div className="h-9 w-20 skeleton-shimmer rounded-xl" />
        </div>
      </div>
    </div>
  );
};