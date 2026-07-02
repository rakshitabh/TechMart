import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value, text, color = 'text-amber-400', onChange }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        onClick={() => onChange && onChange(i)}
        className={`${onChange ? 'cursor-pointer transform hover:scale-125 transition-transform' : ''} inline-block`}
      >
        <Star
          className={`w-5 h-5 ${
            value >= i
              ? `${color} fill-current`
              : value >= i - 0.5
              ? `${color} fill-current opacity-70`
              : 'text-gray-300 dark:text-slate-600'
          }`}
        />
      </span>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">{stars}</div>
      {text && <span className="text-sm font-medium text-gray-500 dark:text-slate-400 ml-2">{text}</span>}
    </div>
  );
};

export default Rating;
