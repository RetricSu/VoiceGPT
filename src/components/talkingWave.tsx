import { useEffect, useState } from 'react';

const LoadingIndicator = () => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === '......') {
          return '.';
        }
        return `${prevDots}.`;
      });
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="mt-4 text-center">
      <span className="text-3xl font-bold text-blue-500">{dots}</span>
    </div>
  );
};

export default LoadingIndicator;
