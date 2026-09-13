import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({ children, delay = 0, y = 22, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.75, delay, ease: EASE }}>
      
      {children}
    </motion.div>);

}