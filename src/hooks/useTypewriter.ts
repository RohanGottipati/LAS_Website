import { useEffect, useState } from 'react';

export type CodeLine = {indent: number;text: string;};

export function useTypewriter(lines: CodeLine[], active: boolean, reduced: boolean, duration = 2600) {
  const full = lines.map((l) => l.text).join('\n');
  const [count, setCount] = useState(reduced ? full.length : 0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setCount(full.length);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const total = full.length;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setCount(Math.floor(total * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, full, reduced, duration]);

  const typed: string[] = [];
  let remaining = count;
  for (const line of lines) {
    if (remaining <= 0) {
      typed.push('');
      continue;
    }
    typed.push(line.text.slice(0, remaining));
    remaining -= line.text.length + 1;
  }
  return { typed, done: count >= full.length };
}