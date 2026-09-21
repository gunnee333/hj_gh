import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './styles.module.scss';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  id?: string;
  backgroundType?: 'green' | 'ivory';
}

interface RevealItemProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export default function Component({
  children,
  className = '',
  id,
  delay = 0,
  duration = 800,
  distance = 24,
  threshold = 0.2,
  backgroundType = 'green'
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // 한 번 나타난 후에는 observer 제거
          observer.unobserve(entry.target);
        }
      },
      {
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const animatedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement<RevealItemProps>(child)) {
      return child;
    }

    const childClassName = child.props.className ?? '';
    const childStyle = child.props.style ?? {};

    return React.cloneElement(child as React.ReactElement<RevealItemProps>, {
      className: [childClassName, styles.revealItem].join(' '),
      style: {
        ...childStyle,
        '--reveal-delay': `${index * delay}ms`,
        '--reveal-duration': `${index * duration}ms`,
        '--reveal-distance': `${index * distance}px`
      } as React.CSSProperties
    });
  });

  return (
    <div
      ref={ref}
      id={id}
      className={[
        styles[backgroundType],
        styles.reveal,
        isVisible ? styles.show : ''
      ].join(' ')}
      style={
        {
          '--reveal-delay': `${delay}ms`,
          '--reveal-duration': `${duration}ms`,
          '--reveal-distance': `${distance}px`
        } as React.CSSProperties
      }
    >
      <div className={[styles.children, className].join(' ')}>
        {animatedChildren}
      </div>
    </div>
  );
}
