import { useEffect, useRef, useState } from 'react';
import { useMotionValue } from 'framer-motion';

export type CursorMode = 'hidden' | 'default' | 'link' | 'text';

const INTERACTIVE = '[data-cursor],a,button,input,textarea,select,[role="button"],label';

export function useCursorState(enabled: boolean) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [supported, setSupported] = useState(false);
  const [mode, setMode] = useState<CursorMode>('hidden');
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);
  const coordsRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setSupported(enabled && mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [enabled]);

  useEffect(() => {
    if (!supported) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const resolve = (target: EventTarget | null) => {
      const el = target instanceof Element ? target.closest(INTERACTIVE) : null;
      if (!el) {
        setMode('default');
        setLabel('');
        return;
      }
      if (el.matches('input,textarea,select')) {
        setMode('text');
        setLabel('');
        return;
      }
      const explicit = el.getAttribute('data-cursor');
      const external = el.tagName === 'A' && el.getAttribute('target') === '_blank';
      setMode('link');
      setLabel(explicit ?? (external ? 'visit' : 'open'));
    };

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (coordsRef.current) {
        coordsRef.current.textContent = `x:${String(Math.round(e.clientX)).padStart(4, '0')} y:${String(
          Math.round(e.clientY)
        ).padStart(4, '0')}`;
      }
    };
    const onOver = (e: PointerEvent) => resolve(e.target);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setMode('hidden');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [supported, x, y]);

  return { supported, x, y, mode, label, pressed, coordsRef };
}