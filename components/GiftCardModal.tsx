
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
    
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background Gradient - Rich Crimson
      const gradient = ctx.createRadialGradient(600, 400, 100, 600, 400, 800);
      gradient.addColorStop(0, '#991b1b'); 
      gradient.addColorStop(1, '#450a0a'); 
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 800);

      // Gold Border
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 15;
      ctx.strokeRect(30, 30, 1140, 740);
      
      // Inner Thinner Border
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, 1090, 690);

      // Corner Ornaments
      const drawOrnament = (x: number, y: number) => {
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
      };
      drawOrnament(30, 30);
      drawOrnament(1170, 30);
      drawOrnament(30, 770);
      drawOrnament(1170, 770);

      // Snow effect on card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for(let i=0; i<300; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 1200, Math.random() * 800, Math.random() * 4, 0, Math.PI * 2);
          ctx.fill();
      }

      // Decorative text
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.fillStyle = '#fde047';
      ctx.textAlign = 'center';
      ctx.font = 'bold 100px serif';
      ctx.fillText('Merry Christmas 2025', 600, 200);

      // Recipient name
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 70px sans-serif';
      ctx.fillText(`Especially for ${name}`, 600, 320);

      // Separator Line
      ctx.beginPath();
      ctx.moveTo(400, 360);
      ctx.lineTo(800, 360);
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Generated message
      ctx.fillStyle = '#fdf4ff';
      ctx.font = 'italic 36px sans-serif';
      const words = message.split(' ');
      let line = '';
      let yPos = 440;
      const maxWidth = 900;
      
      for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, 600, yPos);
          line = words[n] + ' ';
          yPos += 55;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 600, yPos);

      // Footer Section - Updated with George's name
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('🎄 Magical Holiday Wishes 🎄', 600, 660);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 24px sans-serif';
      ctx.fillText('Sent with warmth and joy by George', 600, 710);
      
      // Random Magic Stamp ID
      const magicId = Math.random().toString(36).substring(7).toUpperCase();
      ctx.fillStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`UNIQUE MAGIC ID: ${magicId}`, 600, 745);
      
      ctx.fillStyle = '#fde047';
      ctx.font = '16px sans-serif';
      ctx.fillText('Christmas 2025 Magic • Spread the Love', 600, 765);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Christmas2025_${name}_${magicId}.png`;
      link.href = dataUrl;
      link.click();
    }

    setIsGenerating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-lg w-full shadow-2xl transform transition-transform animate-modal-enter">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="festive-font text-3xl md:text-5xl text-red-600">Gift Card</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <i className="fas fa-times text-xl md:text-2xl"></i>
          </button>
        </div>
        
        <p className="text-gray-700 mb-6 md:mb-8 text-center text-sm md:text-lg italic leading-relaxed">
          "Every snowflake is unique, and so is your message. Enter your name and let us craft a new piece of Christmas magic."
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="relative">
            <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-red-300"></i>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-red-50 outline-none focus:ring-4 focus:ring-red-100 transition-all text-lg md:text-xl text-gray-800"
              required
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={isGenerating || !name.trim()}
            className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white text-lg md:text-2xl font-bold shadow-xl hover:shadow-red-600/40 transform active:scale-95 transition-all festive-font disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-snowflake animate-spin mr-3"></i> Crafting Magic...
              </span>
            ) : (
              <span>Generate New Card 🎁</span>
            )}
          </button>
        </form>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modal-enter {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-enter {
          animation: modal-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default GiftCardModal;
