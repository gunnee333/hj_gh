import styles from './style.module.scss';
import { Video } from '../../assets';
import { useEffect, useRef, useState } from 'react';

export default function Component({ onComplete }: { onComplete?: () => void }) {
  const [hidden, setHidden] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const changeSpeed = (speed: number) => {
    if (ref.current) {
      ref.current.playbackRate = speed;
    }
  };

  useEffect(() => {
    setTimeout(() => changeSpeed(1.2), 500);
    setTimeout(() => changeSpeed(1.4), 1000);
    setTimeout(() => changeSpeed(1.7), 1600);
    setTimeout(() => changeSpeed(2), 2000);
    setTimeout(() => changeSpeed(2.5), 2500);
    setTimeout(() => changeSpeed(3), 3000);
  }, []);

  if (hidden) {
    return null;
  }
  return (
    <div
      className={[styles.container, isFading ? styles.fadeOut : undefined].join(
        ' '
      )}
      onTransitionEnd={() => {
        if (isFading) {
          setHidden(true);
        }
      }}
    >
      <video
        ref={ref}
        src={Video.door}
        autoPlay
        muted
        playsInline
        onLoadStart={() => {
          setTimeout(() => {
            onComplete?.();
          }, 1000);
        }}
        onEnded={() => {
          setIsFading(true);
        }}
      />
      <div className={styles.light}></div>
    </div>
  );
}
