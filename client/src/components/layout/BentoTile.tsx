import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';

interface BentoTileProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  title?: string;
  icon?: React.ReactNode;
  glowColor?: 'emerald' | 'sky' | 'amber' | 'rose' | 'violet' | 'none';
  className?: string;
}

export const BentoTile: React.FC<BentoTileProps> = ({
  children,
  span = 4,
  title,
  icon,
  glowColor = 'none',
  className = '',
}) => {
  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`span-${span}`}
      style={{ height: '100%' }}
    >
      <GlassCard
        glowColor={glowColor}
        hoverable
        className={`bento-tile ${className}`}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        {(title || icon) && (
          <div className="bento-tile-header">
            {title && <span className="bento-tile-title">{title}</span>}
            {icon && <div className="bento-tile-icon">{icon}</div>}
          </div>
        )}
        <div className="bento-tile-body">
          {children}
        </div>
      </GlassCard>
    </motion.div>
  );
};
