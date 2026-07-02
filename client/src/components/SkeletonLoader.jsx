import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 overflow-hidden shadow-sm flex flex-col h-full animate-pulse text-left">
      <div className="aspect-video w-full bg-gray-200 dark:bg-slate-700"></div>
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-1/4 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
          <div className="h-5 w-3/4 bg-gray-205 dark:bg-slate-700 rounded-md"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t dark:border-slate-700">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
          <div className="h-8 w-10 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductSkeleton key={idx} />
      ))}
    </div>
  );
};

export const CartSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/60 gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-xl flex-shrink-0"></div>
            <div className="space-y-2 w-full">
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
              <div className="h-3.5 w-1/3 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
            </div>
          </div>
          <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
            <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
            <div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
            <div className="h-5 w-5 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const OrderHistorySkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2 w-full sm:w-1/2">
            <div className="h-3 w-1/3 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
            <div className="h-5 w-2/3 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
          </div>
          <div className="h-8 w-28 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};
