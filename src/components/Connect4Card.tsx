import React, { useState, useEffect } from 'react';

export const Connect4Card: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSVG = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/connect4-card');
        if (!response.ok) {
          throw new Error('Failed to fetch SVG');
        }
        const svg = await response.text();
        setSvgContent(svg);
        setError('');
      } catch (err) {
        setError('Failed to load Connect 4 card. Make sure the server is running at localhost:3001');
        console.error('Error fetching SVG:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSVG();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading Connect 4 card...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-red-400 text-center">{error}</div>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold text-white mb-4">Connect 4 Game Card</h2>
      <div 
        className="bg-white rounded-lg shadow-lg p-4"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      <p className="text-gray-300 mt-4 text-center">
        This is how your Connect 4 card will look in your README!
      </p>
    </div>
  );
}; 