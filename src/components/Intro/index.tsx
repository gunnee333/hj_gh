import styles from './style.module.scss';
import { Images, Video } from '../../assets';
import { useEffect, useRef, useState } from 'react';

export default function Component({ onComplete }: { onComplete?: () => void }) {
  const [start, setStart] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (start) {
      setTimeout(() => setIsFading(true), 1600);
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
