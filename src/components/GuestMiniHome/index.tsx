/**
 * GuestMinihompy.tsx
 * ------------------------------------------------------------------
 * 컬러 도트게임(포켓몬류 16비트 RPG) 감성의 "하객 정원" 컴포넌트.
 * Firestore에 저장된 참석 응답(GuestCount)을 받아, 참석한 하객이
 * 늘어날 때마다 컬러 도트 캐릭터가 하늘+잔디 화면에 하나씩 나타납니다.
 * 캐릭터를 선택하면 화면 하단에 포켓몬 스타일 대화창이 열립니다.
 *
 * 구성 파일
 * ---------
 *  - sprites.ts            도트 캐릭터/나무 "모양" 데이터 (숫자 문자열 그리드)
 *  - styles.module.scss    색 팔레트 + 게임기 본체/화면/조작부 스타일
 *  - GuestMinihompy.tsx    이 파일 (로직 + 마크업, 하객마다 색을 입히는 부분)
 *
 * 사전 준비
 * ---------
 * 1) 이 세 파일을 같은 폴더에 둡니다.
 * 2) 프로젝트가 *.module.scss 타입을 모른다면, 아래 선언을 한 번 추가하세요.
 *      // global.d.ts
 *      declare module '*.module.scss' {
 *        const classes: { [key: string]: string };
 *        export default classes;
 *      }
 * 3) (선택) 도트 한글 폰트를 앱 진입점에서 한 번 불러오면 더 그럴싸해집니다.
 *      npm i galmuri
 *      import 'galmuri/dist/galmuri.css';
 *
 * 사용법
 * ------
 * const [guests, setGuests] = useState<GuestDoc[]>([]);
 * useEffect(() => {
 *   const q = query(collection(db, 'guests'), where('attendance', '==', true));
 *   return onSnapshot(q, (snap) =>
 *     setGuests(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GuestDoc)))
 *   );
 * }, []);
 *
 * <GuestMinihompy guests={guests} title="OUR GARDEN" />
 */

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

// ============================================================
// 1. 타입 — 기존 저장 타입을 그대로 유지합니다.
// ============================================================

/** 실제 프로젝트에서 쓰는 값으로 맞춰주세요. (예: '신랑'|'신부' 등도 가능) */
export type GuestSide = 'groom' | 'bride';

export type GuestCount = {
  attendance: boolean;
  side: GuestSide;
  name: string;
  relation: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  message?: string;
  createdAt?: any;
};

/** Firestore 문서 id를 포함한 형태. 컴포넌트는 이 타입을 받습니다. */
export type GuestDoc = GuestCount & { id: string };

// ============================================================
// 2. 하객마다 다르게 입힐 색 팔레트 (캐릭터 "모양"은 sprites.ts, "색"은 여기)
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

/** 대화창에 순서대로 보여줄 문장들 (마지막 페이지에서 A를 누르면 닫힙니다) */
function buildDialogPages(g: GuestDoc): string[] {
  const sideLabel = g.side === 'groom' ? '신랑측' : '신부측';
  const pages = [
    `${g.name}(${g.relation}) 님이\n정원에 나타났다!`,
    `${sideLabel} 하객 · 총 ${totalPartySize(g)}명`
  ];
  if (g.message) pages.push(`"${g.message}"`);
  return pages;
}

const TREE_RUNS = toRuns(TREE);

// 화면 장식용 꽃 위치 (고정, 캐릭터와 겹치지 않게 상단 잔디 라인에만 배치)
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

// ============================================================
// 3. 도트 스프라이트 렌더러 — sprites.ts의 숫자 그리드를 <rect>로 그립니다.
// ============================================================

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

/** 머리(8) + 몸(6) + 다리(2) = 16줄짜리 캐릭터를 두 걷기 프레임으로 만듭니다. */
function useCharacterFrames(headKey: HeadKey, side: GuestSide) {
  return useMemo(() => {
    const headRows = HEADS[headKey];
    const bodyRows = side === 'groom' ? BODIES.groom : BODIES.bride;
    return {
      frameA: toRuns([...headRows, ...bodyRows, ...LEGS.a]),
      frameB: toRuns([...headRows, ...bodyRows, ...LEGS.b])
    };
  }, [headKey, side]);
}

// ============================================================
// 4. 캐릭터 한 명
// ============================================================

function MiniAvatar({
  guest,
  isNew,
  focused,
  onSelect
}: {
  guest: GuestDoc;
  isNew: boolean;
  focused: boolean;
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
  const party = totalPartySize(guest);

  return (
    <button
      type="button"
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
      {focused && <span className={styles.cursor}>▼</span>}
      {isNew && <span className={styles.emote}>!</span>}
      {party > 1 && <span className={styles.party}>{party}</span>}

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
    </button>
  );
}

// ============================================================
// 5. 메인 컴포넌트
// ============================================================

export default function GuestMinihompy() {
  const { items: attendees } = useAttendee();
  const idsKey = attendees.map((g) => g.id).join(',');
  const totalHeadcount = attendees.reduce(
    (sum, g) => sum + totalPartySize(g),
    0
  );

  // ---- 새로 도착한 손님 감지: 잠깐 "!" 이모트를 보여줍니다 ----
  const seenIds = useRef<Set<string>>(new Set());
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
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

  // ---- 커서(포커스)와 대화창 상태 ----
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (focusedIndex > attendees.length - 1) {
      setFocusedIndex(Math.max(0, attendees.length - 1));
    }
  }, [attendees.length, focusedIndex]);

  // 대화 중이던 손님이 목록에서 사라지면(참석 취소 등) 대화창을 닫습니다.
  useEffect(() => {
    if (selectedId && !attendees.some((g) => g.id === selectedId)) {
      setSelectedId(null);
      setPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const selected = selectedId
    ? (attendees.find((g) => g.id === selectedId) ?? null)
    : null;
  const pages = useMemo(
    () => (selected ? buildDialogPages(selected) : []),
    [selected?.id]
  );

  // 타자기 효과로 현재 페이지 문장을 한 글자씩 보여줍니다.
  useEffect(() => {
    if (!selected || pages.length === 0) {
      setTyped('');
      return;
    }
    const full = pages[page] ?? '';
    let i = 0;
    setTyped('');
    const timer = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(timer);
    }, 22);
    return () => clearInterval(timer);
  }, [selected, page, pages]);

  function openDialog(index: number) {
    if (!attendees[index]) return;
    setFocusedIndex(index);
    setSelectedId(attendees[index].id);
    setPage(0);
  }
  function closeDialog() {
    setSelectedId(null);
    setPage(0);
  }
  function moveFocus(delta: number) {
    if (attendees.length === 0) return;
    setFocusedIndex(
      (prev) => (prev + delta + attendees.length) % attendees.length
    );
  }
  function pressA() {
    if (selected) {
      if (page < pages.length - 1) setPage((p) => p + 1);
      else closeDialog();
    } else {
      openDialog(focusedIndex);
    }
  }
  function pressB() {
    closeDialog();
  }

  const currentPageDone = typed === (pages[page] ?? '');

  return (
    <div className={styles.console}>
      <div className={styles.bezel}>
        <div className={styles.bezelTop}>
          <span className={styles.led} />
          <span className={styles.brand}>WEDDING ★ QUEST</span>
          <span>COLOR</span>
        </div>

        <div className={styles.screen}>
          <div className={styles.hud}>
            <span className={styles.hudTitle}>'GUEST GARDEN'</span>
            <span className={styles.hudCount}>
              {String(attendees.length).padStart(3, '0')}/
              {String(totalHeadcount).padStart(3, '0')}
            </span>
          </div>

          <div className={styles.field}>
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
                    focused={i === focusedIndex}
                    onSelect={() => openDialog(i)}
                  />
                ))
              )}
            </div>
          </div>

          {selected && (
            <div
              className={styles.dialog}
              role="button"
              tabIndex={0}
              onClick={pressA}
              onKeyDown={(e) => e.key === 'Enter' && pressA()}
            >
              {typed}
              {currentPageDone && <span className={styles.dialogArrow}>▼</span>}
            </div>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.dpad}>
          <button
            type="button"
            className={`${styles.dpadBtn} ${styles.dpadUp}`}
            onClick={() => moveFocus(-1)}
            aria-label="이전 손님"
          />
          <button
            type="button"
            className={`${styles.dpadBtn} ${styles.dpadDown}`}
            onClick={() => moveFocus(1)}
            aria-label="다음 손님"
          />
          <button
            type="button"
            className={`${styles.dpadBtn} ${styles.dpadLeft}`}
            onClick={() => moveFocus(-1)}
            aria-label="이전 손님"
          />
          <button
            type="button"
            className={`${styles.dpadBtn} ${styles.dpadRight}`}
            onClick={() => moveFocus(1)}
            aria-label="다음 손님"
          />
        </div>

        <div className={styles.ab}>
          <button
            type="button"
            className={styles.btn}
            onClick={pressB}
            aria-label="닫기"
          >
            B
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={pressA}
            aria-label="선택 / 다음"
          >
            A
          </button>
        </div>
      </div>

      <div className={styles.pills}>
        <span className={styles.pill} />
        <span className={styles.pill} />
      </div>
    </div>
  );
}
