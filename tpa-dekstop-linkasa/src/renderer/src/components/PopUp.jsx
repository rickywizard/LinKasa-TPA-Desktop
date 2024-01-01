import React, { useState, useEffect } from 'react';

const PopUp = ({ message, onClose, type }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <>
      {isVisible && (
        <div className={`fixed top-4 right-4 w-72 text-white py-3 px-4 rounded-md shadow-md flex justify-between items-center z-10 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          <span>{message}</span>
          <button onClick={() => setIsVisible(false)} className={`text-white p-1 rounded-full ${type === 'error' ? 'hover:bg-red-700' : 'hover:bg-green-700'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default PopUp;
