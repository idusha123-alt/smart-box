import React, { useState, useEffect } from 'react';

export default function App() {
  const [items, setItems] = useState({});

  useEffect(() => {
    const fetchDetections = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/detections');
        const data = await response.json();
        setItems(data.items || {});
      } catch (e) {
        console.error('Failed to fetch detections:', e);
      }
    };

    fetchDetections();
    const interval = setInterval(fetchDetections, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col font-sans bg-[#b4b4b4]">
      <div className="w-full bg-[#c9d2da] py-12 text-center">
        <h1 className="text-7xl font-bold tracking-normal text-[#08113b]">
          SmartBox
        </h1>
      </div>

      <div className="flex-1 w-full bg-[#b4b4b4] px-5 py-6">
        <div className="text-5xl font-bold text-[#3d434c] leading-tight">
          9W2C
        </div>
        <div className="text-4xl font-normal text-[#6d6d6d] mt-1 mb-4 pl-1">
          Current items:
        </div>

        <div className="flex flex-col space-y-1 pl-1">
          {Object.keys(items).length === 0 ? (
            <div className="text-white text-2xl">No items detected</div>
          ) : (
            Object.entries(items).map(([name, quantity]) => (
              <div key={name} className="text-white text-2xl font-normal leading-snug">
                <p>{name}: x{quantity}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}