import React from 'react';

interface EventItemProps {
  label: string;
  meta: string;
  index: number;
  active: boolean;
  pinned: boolean;
  onActivate: () => void;
  onToggle: () => void;
}

export function EventItem({ label, meta, index, active, pinned, onActivate, onToggle }: EventItemProps) {
  const highlighted = active || pinned;

  return (
    <button
      type="button"
      aria-pressed={pinned}
      data-cursor={pinned ? 'unpin' : 'pin'}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onToggle}
      className="group flex w-full items-center gap-4 border-t border-paper/10 py-5 text-left outline-none first:border-t-0 focus-visible:ring-1 focus-visible:ring-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
      
      <span className={`h-4 w-px transition-colors duration-300 ${highlighted ? 'bg-cyan' : 'bg-transparent'}`} />
      <span className={`font-mono text-[11px] tabular-nums ${highlighted ? 'text-cyan' : 'text-paper/35'}`}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="min-w-0">
        <span
          className={`block font-display text-2xl leading-tight transition-[color,transform] duration-300 group-hover:translate-x-1 ${
          highlighted ? 'text-paper' : 'text-paper/80 group-hover:text-paper'}`
          }>
          
          {label}
        </span>
        <span className="mt-1 block font-mono text-[10px] tracking-[0.08em] text-paper/45">{meta}</span>
      </span>
      <span
        className={`ml-auto hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan/70 transition-opacity duration-300 sm:inline ${
        pinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`
        }>
        
        {pinned ? 'Pinned · click to unpin' : 'Click to pin'}
      </span>
    </button>);

}