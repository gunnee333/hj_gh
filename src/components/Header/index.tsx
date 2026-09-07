import moment from "moment";
import { Wedding } from "../../assets";
import { CONSTANT } from "../../util";
import styles from "./style.module.scss";
import "moment/locale/ko";
import { CSSProperties, useMemo } from "react";

type TParticle =
  | {
      id: string;
      type: "dot";
      left: number;
      size: number;
      duration1: number;
      duration2: number;
      delay1: number;
      delay2: number;
      opacity: number;
    }
  | {
      id: string;
      type: "star";
      left: number;
      size: number;
      trail: number;
      duration1: number;
      delay1: number;
      opacity: number;
    };

export default function Component() {
  const STAR_COUNT = 14;
  const DOT_COUNT = 26;

  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  const particles = useMemo<TParticle[]>(() => {
    const items: TParticle[] = [];

    for (let i = 0; i < DOT_COUNT; i++) {
      items.push({
        id: `dot-${i}`,
        type: "dot",
        left: random(0, 100),
        size: random(2.5, 6.5),
        duration1: random(9, 16),
        duration2: random(1.8, 3.4),
        delay1: random(-16, 0),
        delay2: random(0, 2),
        opacity: random(0.2, 0.55),
      });
    }

    for (let i = 0; i < STAR_COUNT; i++) {
      items.push({
        id: `star-${i}`,
        type: "star",
        left: random(4, 96),
        size: random(14, 24),
        trail: random(100, 180),
        duration1: random(8, 13),
        delay1: random(-13, 0),
        opacity: random(0.5, 0.95),
      });
    }

    return items;
  }, []);

  return (
    <div className={styles.container} id={CONSTANT.ELEMENT_ID.HOME}>
      <div className={styles.starOverlay}>
        {particles.map((item) => {
          if (item.type === "dot") {
            const dotStyle = {
              left: `${item.left}%`,
              width: `${item.size}px`,
              height: `${item.size}px`,
              animationDuration: `${item.duration1}s, ${item.duration2}s`,
              animationDelay: `${item.delay1}s, ${item.delay2}s`,
              ["--particle-opacity" as string]: item.opacity,
            } as CSSProperties;

            return <div key={item.id} className={`${styles.particle} ${styles.dot}`} style={dotStyle} />;
          }

          const starStyle = {
            left: `${item.left}%`,
            animationDuration: `${item.duration1}s`,
            animationDelay: `${item.delay1}s`,
            ["--star-size" as string]: `${item.size}px`,
            ["--fall-length" as string]: `${item.trail}px`,
            ["--particle-opacity" as string]: item.opacity,
          } as CSSProperties;

          return (
            <div key={item.id} className={`${styles.particle} ${styles.star}`} style={starStyle}>
              <div className={styles.trail} />
              <div className={styles.starHead}>
                <svg viewBox="0 0 24 24" className={styles.starSvg} aria-hidden="true">
                  <path d="M12 1.8L13.9 9.1L21.2 11L13.9 12.9L12 20.2L10.1 12.9L2.8 11L10.1 9.1L12 1.8Z" fill="white" />
                  <path d="M12 4.4L13.3 9.7L18.6 11L13.3 12.3L12 17.6L10.7 12.3L5.4 11L10.7 9.7L12 4.4Z" fill="white" opacity="0.9" />
                  <circle cx="12" cy="11" r="1.8" fill="white" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      <img src={Wedding.main} alt="" className={styles.img} />
      <div className={styles.bottomText}>
        <div className={styles.title}>
          {CONSTANT.groom.name} & {CONSTANT.bride.name}
        </div>
        <div className={styles.desc}>
          {moment(CONSTANT.date.dateISO).format("YYYY년 MM월 DD일, dddd A h시")}
          <br />
          {CONSTANT.place.fullName}
        </div>
      </div>
    </div>
  );
}
