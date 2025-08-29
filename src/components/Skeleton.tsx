import React from "react";

export const LineSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={`animate-pulse bg-gray-200 rounded h-4 ${className ?? ""}`}
  ></div>
);

export const CardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-gray-100 p-6">
    <div className="animate-pulse bg-gray-200 h-12 w-12 mb-4 rounded"></div>
    <div className="animate-pulse bg-gray-200 h-5 w-3/4 mb-2 rounded"></div>
    <div className="animate-pulse bg-gray-200 h-4 w-5/6 rounded"></div>
  </div>
);
