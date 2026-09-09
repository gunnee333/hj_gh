import React, { CSSProperties, useMemo } from 'react';
import styles from './style.module.scss';

interface IProps {
  count?: number;
  className?: string;
}
interface IParticle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
}

export default function AniOverlay({ count = 20, className = '' }: IProps) {
  const particles = useMemo<IParticle[]>(() => {
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * -5,
      duration: 4 + Math.random() * 3,
      rotation: Math.random() * 360
    }));
  }, [count]);

  return (
    <div className={[styles.container, className].join(' ')} aria-hidden="true">
      {particles.map((item, index) => {
        const sizeClass =
          index % 3 === 0 ? styles.lg : index % 3 === 1 ? styles.md : styles.sm;

        const style = {
          left: `${item.left}%`,
          '--duration': `${item.duration}s`,
          '--rotation': `${item.rotation}deg`,
          animationDelay: `${item.delay}s`
        } as CSSProperties;

        return (
          <span
            key={index}
            className={[styles.item, sizeClass].join(' ')}
            style={style}
          >
            <svg viewBox="0 0 5 8" aria-hidden="true">
              <rect x="0" y="0" width="5" height="8"></rect>
            </svg>
          </span>
        );
      })}
    </div>
  );
}
