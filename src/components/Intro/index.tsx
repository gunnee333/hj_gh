import styles from './style.module.scss';
import { Images, Video } from '../../assets';
import { useEffect, useRef, useState } from 'react';

export default function Component({ onComplete }: { onComplete?: () => void }) {
  const [start, setStart] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const changeSpeed = (speed: number) => {
    if (ref.current) {
      ref.current.playbackRate = speed;
    }
  };

  useEffect(() => {
    if (start) {
      setTimeout(() => changeSpeed(1.2), 0);
      setTimeout(() => changeSpeed(1.5), 500);
      setTimeout(() => changeSpeed(1.9), 1000);
      setTimeout(() => changeSpeed(2.4), 1600);
      setTimeout(() => changeSpeed(2.6), 2000);
      setTimeout(() => changeSpeed(3), 2500);
      setTimeout(() => changeSpeed(3.5), 3000);
      setTimeout(() => changeSpeed(10), 3200);
    }
  }, [start]);

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
        autoPlay
        muted
        playsInline
        onLoadStart={() => {
          setStart(true);
          setTimeout(() => {
            onComplete?.();
          }, 1000);
        }}
        onEnded={() => {
          setIsFading(true);
        }}
        poster={Images.introImg}
        className={styles.video}
      >
        <source src={Video.door} type="video/mp4" />
      </video>
      <div className={styles.light}></div>
    </div>
  );
}
