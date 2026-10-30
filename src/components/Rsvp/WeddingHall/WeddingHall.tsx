import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import styles from './style.module.scss';
import { layoutSeats } from './layout';
import { GUEST_SPRITES } from './sprites';
import type { Seat, WeddingHallProps } from './types';

import brideImg from './assets/bride.png';
import groomImg from './assets/groom.png';
import chairEmpty from './assets/chair-empty.png';
import bushLeft from './assets/bush-left.png';
import bushRight from './assets/bush-right.png';
import wallFlowerA from './assets/wall-flower-1.png';
import wallFlowerB from './assets/wall-flower-2.png';

/** 디자인 기준 크기 (도트 1칸 = 1px). scss 의 값과 맞춰져 있습니다. */
const COL_WIDTH = 88;
const SIDE_PADDING = 16;
const AISLE_WIDTH = 216;

const cx = (...names: Array<string | false | undefined>) =>
  names.filter(Boolean).join(' ');

const spriteOf = (seat: Seat) => {
  const idx = seat.ordinal * 7 + 3;
  const len = GUEST_SPRITES.length;
  return GUEST_SPRITES[((idx % len) + len) % len];
};

const WeddingHall = ({
  guests = [],
  defaultRows = 2,
  autoExpandRows = true,
  maxRows,
  columnsPerSide: columnsProp = 3,
  separateBySide = true,
  showEmptySeats = true,
  scale = 'auto',
  className,
  onGuestClick,
  setIsAttendeeModal
}: WeddingHallProps) => {
  const columnsPerSide = Math.max(1, Math.floor(columnsProp));
  const wrapRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(1);

  const designWidth =
    2 * (columnsPerSide * COL_WIDTH + SIDE_PADDING) + AISLE_WIDTH;

  useEffect(() => {
    if (scale !== 'auto') return;
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setAutoScale(Math.min(2, Math.max(0.3, w / designWidth)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scale, designWidth]);

  const s = scale === 'auto' ? autoScale : scale;

  const layout = useMemo(
    () =>
      layoutSeats(guests, {
        defaultRows,
        autoExpandRows,
        maxRows,
        columnsPerSide,
        separateBySide
      }),
    [
      guests,
      defaultRows,
      autoExpandRows,
      maxRows,
      columnsPerSide,
      separateBySide
    ]
  );

  const renderSeat = (seat: Seat, side: 'left' | 'right') => {
    const key = `${side}-${seat.rowFromBottom}-${seat.colFromAisle}`;

    if (!seat.guest) {
      return (
        <div key={key} className={styles.seat}>
          {showEmptySeats && (
            <img
              className={cx(styles.sprite, styles.empty)}
              src={chairEmpty}
              alt=""
              draggable={false}
            />
          )}
        </div>
      );
    }

    const guest = seat.guest;
    const label = guest.name ?? '하객';
    const delay = {
      '--delay': `${Math.min(seat.ordinal, 20) * 40}ms`
    } as CSSProperties;
    const inner = (
      <>
        <img
          className={styles.sprite}
          src={spriteOf(seat)}
          alt={label}
          draggable={false}
        />
        {guest.name && <span className={styles.nameTag}>{guest.name}</span>}
      </>
    );

    return (
      <div key={key} className={styles.seat}>
        {onGuestClick ? (
          <button
            type="button"
            className={cx(styles.guest, styles.clickable)}
            style={delay}
            onClick={() => onGuestClick(guest)}
          >
            {inner}
          </button>
        ) : (
          <div className={styles.guest} style={delay}>
            {inner}
          </div>
        )}
      </div>
    );
  };

  /** 위(먼 줄) → 아래(가까운 줄) 순서로 그린다 */
  const renderSide = (rowsData: Seat[][], side: 'left' | 'right') => (
    <div
      className={cx(styles.side, side === 'left' ? styles.left : styles.right)}
    >
      {[...rowsData].reverse().map((row) => (
        <div
          key={row[0].rowFromBottom}
          className={styles.row}
          style={{ zIndex: layout.rows - row[0].rowFromBottom }}
        >
          {row.map((seat) => renderSeat(seat, side))}
        </div>
      ))}
    </div>
  );

  const vars = { '--s': s, '--cols': columnsPerSide } as CSSProperties;

  return (
    <div ref={wrapRef} className={cx(styles.wrap, className)}>
      <div
        className={styles.hall}
        style={vars}
        role="group"
        aria-label={`결혼식장. 하객 ${guests.length}명`}
      >
        {/* 벽 */}
        <div className={styles.wall}>
          {[0, 25, 50, 75, 100].map((pos, i) => (
            <div
              key={pos}
              className={styles.pillar}
              style={{ left: `${pos}%` }}
            >
              {i % 2 === 1 && (
                <img
                  className={styles.wallFlower}
                  src={i === 1 ? wallFlowerA : wallFlowerB}
                  alt=""
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>

        {/* 바닥 */}
        <div className={styles.floor}>
          <div className={styles.seating}>
            {renderSide(layout.left, 'left')}

            <div className={styles.aisle}>
              <div className={cx(styles.garland)} />
              <div className={styles.carpet} />
              <div className={cx(styles.garland)} />
            </div>

            {renderSide(layout.right, 'right')}
          </div>

          {layout.overflow > 0 && (
            <div className={styles.overflow}>
              자리가 부족해요 +{layout.overflow}
            </div>
          )}

          {/* 단상 */}
          <div className={styles.stage}>
            <img
              className={cx(styles.bush, styles.bushLeft)}
              src={bushLeft}
              alt=""
              draggable={false}
            />
            <img
              className={cx(styles.bush, styles.bushRight)}
              src={bushRight}
              alt=""
              draggable={false}
            />
            <div className={styles.step3}>
              <div className={styles.stairCarpet} />
            </div>
            <div className={styles.step2}>
              <div className={styles.stairCarpet} />
            </div>
            <div className={styles.step1}>
              <div className={styles.surface} />
              <div className={styles.front} />
            </div>
            <div className={styles.couple}>
              <img
                className={styles.groom}
                src={groomImg}
                alt="신랑"
                draggable={false}
              />
              <img
                className={styles.bride}
                src={brideImg}
                alt="신부"
                draggable={false}
              />
            </div>
          </div>
        </div>
        <footer className={styles.footer}>
          <button
            onClick={() => setIsAttendeeModal?.(true)}
            className={styles.btn}
          >
            참여하기
          </button>
        </footer>
      </div>
    </div>
  );
};

export default WeddingHall;
