import React from 'react';
import { LogoMark } from './LogoMark';

interface LogoProps {
  /** Mark is 9:4. Size by height with a matching width. */
  className?: string;
  interactive?: boolean;
}

export function Logo({ className = 'h-8 w-[72px]', interactive = false }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Laurier Analytics Society logo"
      className={`relative block shrink-0 transition-[filter,transform] duration-300 ${
      interactive ? 'group-hover:-translate-y-0.5 group-hover:drop-shadow-[0_0_10px_rgba(94,234,212,0.45)]' : ''} ${
      className}`}>
      
      <LogoMark className="h-full w-full" />
    </span>);

}
