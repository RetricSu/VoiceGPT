import React from 'react';

type LoadingProps = {
  text: string;
};

const Loading: React.FC<LoadingProps> = ({ text }) => {
  return (
    <div className="inline-block">
      <div className="flex items-center">
        <svg
          className="mr-3 h-5 w-5 animate-spin text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 100-16 8 8 0 000 16z"
          ></path>
        </svg>
        <span className="text-sm text-gray-500">{text}</span>
      </div>
    </div>
  );
};

export default Loading;
