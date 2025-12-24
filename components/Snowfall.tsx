
import React, { useEffect, useRef } from 'react';
import { Snowflake, Star } from '../types';

const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const snowflakes: Snowflake[] = [];
    const stars: Star[] = [];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      snowflakes.length = 0;
      for (let i = 0; i < 150; i++) {
        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          wind: Math.random() * 0.5 - 0.25,
        });
      }

      stars.length = 0;
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.7,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#020617');
      gradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Stars
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Draw Snow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      snowflakes.forEach(snow => {
        ctx.moveTo(snow.x, snow.y);
        ctx.arc(snow.x, snow.y, snow.radius, 0, Math.PI * 2);
        
        snow.y += snow.speed;
        snow.x += snow.wind;

        if (snow.y > height) {
          snow.y = -10;
          snow.x = Math.random() * width;
        }
        if (snow.x > width) snow.x = 0;
        if (snow.x < 0) snow.x = width;
      });
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      init();
    };

    init();
    draw();

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default Snowfall;
