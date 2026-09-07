import styles from "./style.module.scss";
import { Video } from "../../assets";
import { useState } from "react";

export default function Component({ onComplete }: { onComplete?: () => void }) {
  const [hidden, setHidden] = useState(false);
  const [isFading, setIsFading] = useState(false);

  if (hidden) {
    return null;
  }

  return (
    <div
      className={[styles.container, isFading ? styles.fadeOut : undefined].join(" ")}
      onTransitionEnd={() => {
        if (isFading) {
          setHidden(true);
        }
      }}
    >
      <video
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
    </div>
  );
}
