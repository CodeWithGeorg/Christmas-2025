
import React, { useState } from 'react';
import { generateFestiveMessage } from '../services/geminiService';

interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GiftCardModal: React.FC<GiftCardModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsGenerating(true);
    const message = await generateFestiveMessage(name);
    
    // Create hidden canvas for image generation
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
      gradient.addColorStop(0, '#7f1d1d'); // red-900
      gradient.addColorStop(1, '#450a0a'); // red-950
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);

      // Border
      ctx.strokeStyle = '#fde047'; // yellow-300
      ctx.lineWidth = 20;
      ctx.strokeRect(10, 10, 1180, 610);

      // Snow effect on card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for(let i=0; i<200; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 1200, Math.random() * 630, Math.random() * 3, 0, Math.PI * 2);
          ctx.fill();
      }

      // Decorative text
      ctx.fillStyle = '#fde047';
      ctx.textAlign = 'center';
      ctx.font = 'bold 80px "Mountains of Christmas", serif';
      ctx.fillText('Merry Christmas 2025', 600, 150);

      // Recipient name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px "Quicksand", sans-serif';
      ctx.fillText(`Dearest ${name}`, 600, 250);

      // Generated message
      ctx.fillStyle = '#ffffff';
      ctx.font = '32px "Quicksand", sans-serif';
      const words = message.split(' ');
      let line = '';
      let y = 350;
      const maxWidth = 800;
      
      for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, 600, y);
          line = words[n] + ' ';
          y += 45;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 600, y);

      // Footer
      ctx.fillStyle = '#fde047';
      ctx.font = 'italic 24px "Quicksand", sans-serif';
      ctx.fillText('Sent with love from Christmas 2025 Magic', 600, 550);

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Christmas_2025_Gift_Card_${name}.png`;
      link.href = dataUrl;
      link.click();
    }

    setIsGenerating(false);
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
        <h2 className="festive-font text-4xl text-red-700 mb-6 text-center">Create Your Gift Card</h2>
        <p className="text-gray-600 mb-6 text-center">Enter your name to receive a personalized AI-generated Christmas gift card!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg border-2 border-red-100 focus:border-red-500 outline-none text-gray-800 text-lg"
            required
            autoFocus
          />
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-bold flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-snowflake animate-spin mr-2"></i>
                  Magic...
                </>
              ) : (
                'Generate & Download'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiftCardModal;
