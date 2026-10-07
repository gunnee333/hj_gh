import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.scss';
import {
  BODIES,
  BRIDE_HEADS,
  GROOM_HEADS,
  HEADS,
  LEGS,
  SPRITE_COLS,
  SPRITE_ROWS,
  TREE,
  TREE_COLS,
  TREE_ROWS,
  toRuns,
  type HeadKey,
  type Run
} from './sprites';
import { useAttendee } from '../../hooks';
import { GuestCount, GuestSide } from '../../util/constant';
import { Svgs } from '../../assets';
import { AttendeeModal } from '../AttendeeModal';

export type GuestDoc = GuestCount & { id: string };

// ============================================================
// 하객마다 다르게 입힐 색 팔레트 (캐릭터 "모양"은 sprites.ts, "색"은 여기)
// ============================================================
const SKIN_TONES = ['#ffd9b3', '#ffe3c2', '#f3c89a', '#e8b48c'];
const HAIR_COLORS = ['#3b2a20', '#5a3b2b', '#232323', '#7a4a2b', '#4a3327'];
const GROOM_OUTFITS = ['#4f7fd1', '#3f6bc0', '#5c8ad9'];
const BRIDE_OUTFITS = ['#e8749a', '#d95f8a', '#ef8aac'];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function totalPartySize(g: GuestCount): number {
  const n = (g.adultCount || 0) + (g.childCount || 0) + (g.infantCount || 0);
  return n > 0 ? n : 1;
}

const TREE_RUNS = toRuns(TREE);
const FLOWERS: {
  left: string;
  top: string;
  kind: 'flowerRed' | 'flowerYellow' | 'flowerWhite';
}[] = [
  { left: '14%', top: '46px', kind: 'flowerYellow' },
  { left: '34%', top: '58px', kind: 'flowerWhite' },
  { left: '62%', top: '48px', kind: 'flowerRed' },
  { left: '82%', top: '60px', kind: 'flowerYellow' }
];

export default function GuestMinihompy() {
  const { items: attendees } = useAttendee();

  const [isAttendeeModal, setIsAttendeeModal] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typed, setTyped] = useState('');

  const seenIds = useRef<Set<string>>(new Set());

  const idsKey = attendees.map((g) => g.id).join(',');
  const selected = selectedId
    ? (attendees.find((g) => g.id === selectedId) ?? null)
    : null;
  const dialogText = useMemo(
    () => (selected ? `${selected.name} 님이\n정원에 나타났다!` : null),
    [selected?.id]
  );
  const currentPageDone = typed === (dialogText ?? '');

  function openDialog(index: number) {
    if (!attendees[index]) return;
    setFocusedIndex(index);
    setSelectedId(attendees[index].id);
  }
  function closeDialog() {
    setSelectedId(null);
  }

  useEffect(() => {
    if (selectedId && !attendees.some((g) => g.id === selectedId)) {
      setSelectedId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  useEffect(() => {
    // 타자기 효과로 현재 페이지 문장을 한 글자씩 보여줍니다.
    if (!selected || !dialogText) {
      setTyped('');
      return;
    }
    const full = dialogText ?? '';
    let i = 0;
    setTyped('');
    const timer = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(timer);
    }, 22);
    return () => clearInterval(timer);
  }, [selected, dialogText]);

  useEffect(() => {
    if (focusedIndex > attendees.length - 1) {
      setFocusedIndex(Math.max(0, attendees.length - 1));
    }
  }, [attendees.length, focusedIndex]);

  useEffect(() => {
    const fresh = new Set<string>();
    attendees.forEach((g) => {
      if (!seenIds.current.has(g.id)) fresh.add(g.id);
    });
    if (fresh.size > 0) {
      setNewIds(fresh);
      const timer = setTimeout(() => {
        fresh.forEach((id) => seenIds.current.add(id));
        setNewIds(new Set());
      }, 1300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return (
    <>
      <div className={styles.conatiner}>
        <div className={styles.bezel}>
          <div className={styles.bezelTop}>
            <span className={styles.led} />
            <span className={styles.brand}>
              현중<span>❤︎</span>건희 결혼식
            </span>
          </div>

          <div className={styles.screen}>
            <div className={styles.hud}>
              <span className={styles.hudTitle}>참석자 놀이터</span>
              <span className={styles.hudCount}>
                현재 {attendees.length.toLocaleString()}명 참석중
              </span>
            </div>

            <div className={styles.background}>
              <div className={styles.sky} />

              <div className={`${styles.tree} ${styles.treeL}`}>
                <PixelLayer
                  runs={TREE_RUNS}
                  cols={TREE_COLS}
                  rows={TREE_ROWS}
                  classPrefix="tree"
                  className={styles.frame}
                />
              </div>
              <div className={`${styles.tree} ${styles.treeR}`}>
                <PixelLayer
                  runs={TREE_RUNS}
                  cols={TREE_COLS}
                  rows={TREE_ROWS}
                  classPrefix="tree"
                  className={styles.frame}
                />
              </div>

              {FLOWERS.map((f, i) => (
                <span
                  key={i}
                  className={`${styles.flower} ${styles[f.kind]}`}
                  style={{ left: f.left, top: f.top }}
                />
              ))}

              <div className={styles.yard}>
                {attendees.length === 0 ? (
                  <p className={styles.empty}>
                    아직 아무도
                    <br />
                    도착하지 않았다...
                  </p>
                ) : (
                  attendees.map((g, i) => (
                    <MiniAvatar
                      key={g.id}
                      guest={g}
                      isNew={newIds.has(g.id)}
                      onSelect={() => openDialog(i)}
                    />
                  ))
                )}
              </div>

              <div
                className={[styles.dialog, selected ? styles.show : ''].join(
                  ' '
                )}
                role="button"
                tabIndex={0}
                onClick={closeDialog}
                onKeyDown={(e) => e.key === 'Enter' && closeDialog()}
              >
                {typed}
                {currentPageDone && (
                  <span className={styles.dialogArrow}>▼</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setIsAttendeeModal(true)} className={styles.btn}>
          <Svgs.Carendar stroke="#fff" width={12} />
          참여하기
        </button>
      </div>
      <AttendeeModal
        visible={isAttendeeModal}
        close={() => setIsAttendeeModal(false)}
      />
    </>
  );
}

function MiniAvatar({
  guest,
  isNew,
  onSelect
}: {
  guest: GuestDoc;
  isNew: boolean;
  onSelect: () => void;
}) {
  const seed = hashString(guest.id || guest.name);
  const isGroomSide = guest.side === 'groom';

  const headPool = isGroomSide ? GROOM_HEADS : BRIDE_HEADS;
  const headKey = headPool[seed % headPool.length];
  const skin = SKIN_TONES[(seed >> 1) % SKIN_TONES.length];
  const hair = HAIR_COLORS[(seed >> 2) % HAIR_COLORS.length];
  const outfitPool = isGroomSide ? GROOM_OUTFITS : BRIDE_OUTFITS;
  const outfit = outfitPool[(seed >> 3) % outfitPool.length];

  const flip = (seed >> 4) % 2 === 0;
  const delay = `${(seed % 10) / 10}s`;
  const { frameA, frameB } = useCharacterFrames(headKey, guest.side);

  return (
    <div
      className={`${styles.avatar} ${isNew ? styles.avatarNew : ''}`}
      style={
        {
          '--hair': hair,
          '--skin': skin,
          '--outfit': outfit,
          '--delay': delay
        } as React.CSSProperties
      }
      onClick={onSelect}
      aria-label={`${guest.name}님 (${guest.relation})`}
    >
      {isNew && <span className={styles.emote}>!</span>}

      <span className={`${styles.sprite} ${flip ? styles.flip : ''}`}>
        <PixelLayer
          runs={frameA}
          cols={SPRITE_COLS}
          rows={SPRITE_ROWS}
          classPrefix="av"
          className={`${styles.frame} ${styles.frameA}`}
        />
        <PixelLayer
          runs={frameB}
          cols={SPRITE_COLS}
          rows={SPRITE_ROWS}
          classPrefix="av"
          className={`${styles.frame} ${styles.frameB}`}
        />
      </span>

      <span className={styles.nameplate}>{guest.name}</span>
    </div>
  );
}

function PixelLayer({
  runs,
  cols,
  rows,
  className,
  classPrefix
}: {
  runs: Run[];
  cols: number;
  rows: number;
  className: string;
  classPrefix: 'av' | 'tree';
}) {
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {runs.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={1}
          className={styles[`${classPrefix}Px${r.c}`]}
        />
      ))}
    </svg>
  );
}

function useCharacterFrames(headKey: HeadKey, side: GuestSide) {
  /** 머리(8) + 몸(6) + 다리(2) = 16줄짜리 캐릭터를 두 걷기 프레임으로 만듭니다. */
  return useMemo(() => {
    const headRows = HEADS[headKey];
    const bodyRows = side === 'groom' ? BODIES.groom : BODIES.bride;
    return {
      frameA: toRuns([...headRows, ...bodyRows, ...LEGS.a]),
      frameB: toRuns([...headRows, ...bodyRows, ...LEGS.b])
    };
  }, [headKey, side]);
}
