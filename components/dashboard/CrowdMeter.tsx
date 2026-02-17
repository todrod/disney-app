"use client";

import { useEffect, useState } from 'react';

interface CrowdMeterProps {
  value: number; // 1-10 scale
  label: string;
  animate?: boolean;
  direction?: 'up' | 'down' | 'none';
}

export default function CrowdMeter({ value, label, animate = false, direction = 'none' }: CrowdMeterProps) {
  const [animatedValue, setAnimatedValue] = useState(value);
  
  // Animate value changes for smooth transitions
  useEffect(() => {
    if (!animate) {
      setAnimatedValue(value);
      return;
    }
    
    // Animate from previous value to new value
    const startValue = animatedValue;
    const endValue = value;
    const duration = 500; // ms
    const startTime = Date.now();
    
    const animateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      setAnimatedValue(Math.round(currentValue * 10) / 10);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    
    animateValue();
  }, [value, animate]);
  
  // Determine color based on crowd level
  const getColor = (val: number) => {
    if (val <= 3) return 'bg-success';
    if (val <= 6) return 'bg-warning';
    return 'bg-danger';
  };
  
  // Animation classes
  const getAnimationClass = () => {
    if (!animate) return '';
    
    switch (direction) {
      case 'up':
        return 'animate-pulse';
      case 'down':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`flex flex-col gap-1 ${getAnimationClass()}`} 
      role="meter" 
      aria-valuenow={value} 
      aria-valuemin={0} 
      aria-valuemax={10} 
      aria-label={`Crowd level: ${label}`}
    >
      {/* Scale bar */}
      <div className="flex gap-0.5 h-2">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-all duration-300 ${
              i < animatedValue ? getColor(animatedValue) : 'bg-surface3'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      {/* Label */}
      <span className="text-xs text-text-muted font-medium">{label}</span>
    </div>
  );
}
