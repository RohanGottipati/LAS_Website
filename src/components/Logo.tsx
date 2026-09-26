import React from 'react';
import { LogoMark } from './LogoMark';

interface LogoProps {
  className?: string;
  interactive?: boolean;
}

export function Logo({ className = 'h-9 w-9', interactive = false }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Laurier Analytics Society logo"
      className={`relative grid shrink-0 place-items-center border border-cyan/30 bg-ink transition-[border-color,box-shadow,background-color] duration-300 ${
      interactive ?
      'group-hover:border-cyan group-hover:bg-cyan/[0.06] group-hover:shadow-[0_0_28px_-6px_rgba(94,234,212,0.65)]' :
      ''} ${
      className}`}>
      
      <LogoMark className="h-[78%] w-[78%] translate-x-[4%]" />
    </span>);

}