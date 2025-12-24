
import React, { useEffect, useRef, useState } from 'react';

const ChristmasTree: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentEffect, setCurrentEffect] = useState<'tree' | 'text'>('tree');
  
  const particleGap = 3; 
  const mouse = useRef({ x: -1000, y: -1000, radius: 80 });
  const particles = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);

  class Particle {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    friction: number;
    ease: number;

    constructor(x: number, y: number, color: string, w: number, h: number) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.targetX = x;
      this.targetY = y;
      this.vx = 0;
      this.vy = 0;
      this.color = color;
      this.size = Math.random() * 2 + 1;
      this.friction = 0.92;
      this.ease = 0.04 + Math.random() * 0.04;
    }

    update() {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      
      this.vx += dx * this.ease;
      this.vy += dy * this.ease;
      
      const dxMouse = mouse.current.x - this.x;
      const dyMouse = mouse.current.y - this.y;
      const distance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      
      if (distance < mouse.current.radius) {
        const angle = Math.atan2(dyMouse, dxMouse);
        const force = (mouse.current.radius - distance) / mouse.current.radius;
        const pushX = Math.cos(angle) * force * 15;
        const pushY = Math.sin(angle) * force * 15;
        
        this.vx -= pushX;
        this.vy -= pushY;
      }

      this.vx *= this.friction;
      this.vy *= this.friction;

      this.x += this.vx;
      this.y += this.vy;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.size, this.size);
      ctx.fill();
    }
  }

  const getPixelsFromText = (text: string, fontSize: number, color: string, w: number, h: number) => {
    const tempCanvas = document.createElement('canvas');
    const tCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = w;
    tempCanvas.height = h;
    
    tCtx.font = `bold ${fontSize}px sans-serif`;
    tCtx.fillStyle = color;
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle';
    tCtx.fillText(text, w / 2, h / 2);

    const imageData = tCtx.getImageData(0, 0, w, h).data;
    const coords: {x: number, y: number, color: string}[] = [];

    for (let y = 0; y < h; y += particleGap) {
      for (let x = 0; x < w; x += particleGap) {
        const index = (y * w + x) * 4;
        const alpha = imageData[index + 3];
        if (alpha > 128) {
          const r = imageData[index];
          const g = imageData[index + 1];
          const b = imageData[index + 2];
          coords.push({ x, y, color: `rgb(${r},${g},${b})` });
        }
      }
    }
    return coords;
  };

  const getTreePoints = (w: number, h: number) => {
    const coords: {x: number, y: number, color: string}[] = [];
    const centerX = w / 2;
    const topY = h * 0.1;
    const bottomY = h * 0.75;
    const foliageHeight = bottomY - topY;

    // Foliage in 3 Tiers
    const tiers = 3;
    for (let i = 0; i < tiers; i++) {
      // Overlap tiers slightly for a fuller look
      const tierTop = topY + (i * foliageHeight / tiers) * 0.85;
      const tierBottom = topY + ((i + 1) * foliageHeight / tiers);
      const tierH = tierBottom - tierTop;
      const maxTierWidth = (i + 1) * (w * 0.14);

      for (let y = tierTop; y < tierBottom; y += particleGap) {
        const progress = (y - tierTop) / tierH;
        const currentWidth = progress * maxTierWidth;
        
        for (let x = centerX - currentWidth; x < centerX + currentWidth; x += particleGap) {
          if (Math.random() > 0.05) {
            const isDecoration = Math.random() > 0.94;
            // Mixed shades of green
            const green = Math.random() > 0.5 ? '#166534' : '#15803d';
            const color = isDecoration 
              ? (Math.random() > 0.5 ? '#ef4444' : '#3b82f6') 
              : (Math.random() > 0.85 ? '#fbbf24' : green);
            coords.push({ x, y, color });
          }
        }
      }
    }

    // Trunk
    const trunkWidth = w * 0.04;
    const trunkHeight = h * 0.08;
    for (let y = bottomY; y < bottomY + trunkHeight; y += particleGap) {
      for (let x = centerX - trunkWidth; x < centerX + trunkWidth; x += particleGap) {
        coords.push({ x, y, color: '#713f12' }); // Brown
      }
    }

    return coords; 
  };

  const updateEffect = (type: 'tree' | 'text') => {
    if (!canvasRef.current) return;
    const w = canvasRef.current.width / (window.devicePixelRatio || 1);
    const h = canvasRef.current.height / (window.devicePixelRatio || 1);
    
    let coords: {x: number, y: number, color: string}[] = [];
    if (type === 'text') {
      coords = getPixelsFromText("MERRY XMAS", w < 500 ? 40 : 60, '#fbbf24', w, h);
    } else if (type === 'tree') {
      coords = getTreePoints(w, h);
      const star = getPixelsFromText("★", 60, '#fbbf24', w, h);
      // Position star perfectly on the top peak
      star.forEach(p => p.y = p.y - h/2 + (h * 0.1));
      coords = [...coords, ...star];
    }

    if (particles.current.length === 0) {
      particles.current = coords.map(p => new Particle(p.x, p.y, p.color, w, h));
    } else {
      if (coords.length > particles.current.length) {
        const diff = coords.length - particles.current.length;
        for(let i=0; i<diff; i++) {
          particles.current.push(new Particle(Math.random()*w, Math.random()*h, '#fff', w, h));
        }
      } else if (coords.length < particles.current.length) {
        particles.current.splice(coords.length);
      }
      
      coords.forEach((p, i) => {
        particles.current[i].targetX = p.x;
        particles.current[i].targetY = p.y;
        particles.current[i].color = p.color;
      });
    }
    setCurrentEffect(type);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      updateEffect(currentEffect);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    mouse.current.x = clientX - rect.left;
    mouse.current.y = clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouse.current.x = -1000;
    mouse.current.y = -1000;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div 
        ref={containerRef}
        className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] mb-4 bg-black/10 rounded-3xl overflow-hidden touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      <div className="flex space-x-3 sm:space-x-4">
        {[
          { id: 'tree', label: '🎄 Tree', icon: 'fa-tree' },
          { id: 'text', label: '✨ Xmas', icon: 'fa-sparkles' }
        ].map(effect => (
          <button
            key={effect.id}
            onClick={() => updateEffect(effect.id as any)}
            className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all transform active:scale-95 flex items-center shadow-lg border-2 ${
              currentEffect === effect.id 
                ? 'bg-yellow-400 text-red-900 border-yellow-200 scale-110' 
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="mr-2 hidden sm:inline">{effect.label}</span>
            <span className="sm:hidden">{effect.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChristmasTree;
