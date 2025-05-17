"use client";

import { ReactNode } from "react";

interface MotionProps {
  children?: ReactNode;
  className?: string;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  onClick?: () => void;
}

export const motion = {
  div: function MotionDiv({ 
    children, 
    className = "", 
    initial = {}, 
    animate = {}, 
    transition = {},
    onClick
  }: MotionProps) {
    return (
      <div 
        className={`transition-all ${className}`}
        style={{
          opacity: animate.opacity,
          transform: `translateY(${animate.y || 0}px) translateX(${animate.x || 0}px) scale(${animate.scale || 1})`,
          transitionDuration: `${transition.duration || 0.3}s`,
          transitionTimingFunction: transition.ease === "easeOut" ? "ease-out" : "ease",
          transitionDelay: transition.delay ? `${transition.delay}s` : "0s"
        }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
};