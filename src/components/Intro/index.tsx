import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject
} from 'react';
import { createPortal } from 'react-dom';
import styles from './style.module.scss';
import constants from '../../util/constant';

export interface CoverFace {
  groom: string;
  bride: string;
  groomKo: string;
  brideKo: string;
  dateText: string;
  dayText: string;
}

export interface EnvelopeStageProps extends Partial<CoverFace> {
  /** 씰에 새길 이니셜 [신랑, 신부] */
  monogram?: [string, string];
  /** 씰 하단 연도 */
  year?: string;
  /** 인트로 상단 문구 */
  eyebrow?: string;
  /** 봉투 앞면 필기체 문구 */
  pocketText?: string;
  /** 하단 안내(영문) */
  tapEn?: string;
  /** 하단 안내(한글) */
  tapKo?: string;
  /**
   * 본문 cover 의 <CoverCore ref={...} /> 에 연결한 ref.
   * 지정하면 카드 글자가 그 위치로 정확히 이어 붙습니다. 없으면 제자리에서 사라집니다.
   */
  coverTargetRef?: RefObject<HTMLElement | null>;
  /** true 면 자동으로 열림 (미리보기용) */
  autoOpen?: boolean;
  /** 봉투를 누른 순간 */
  onOpenStart?: () => void;
  /** 카드가 화면을 덮은 시점 → 여기서 본문을 보이게 하세요 */
  onOpened?: () => void;
  /** 스테이지가 완전히 사라진 뒤 */
  onClosed?: () => void;
  onComplete?: () => void;
}

interface Steps {
  ready: boolean;
  s1: boolean;
  s2: boolean;
  s3: boolean;
  s5: boolean;
  done: boolean;
}

interface FlyState {
  stageW: number;
  stageH: number;
  grow: boolean;
  move: { tx: number; ty: number; k: number } | null;
  card: { left: number; top: number; width: number; height: number };
  core: { left: number; top: number; width: number };
}

interface LatestProps {
  onOpenStart?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
  coverTargetRef?: RefObject<HTMLElement | null>;
  autoOpen: boolean;
}

/* ───────── helpers (모듈 레벨, 한 번만 계산) ───────── */

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** 코튼지 섬유 질감: 이음매 없는 타일을 canvas 로 그려 data URL 로 반환 */
let fiberCache: string | null = null;
function getFiberTexture(): string | null {
  if (fiberCache || typeof document === 'undefined') return fiberCache;
  const S = 256,
    R = 2;
  const c = document.createElement('canvas');
  c.width = c.height = S * R;
  const g = c.getContext('2d');
  if (!g) return null;
  g.scale(R, R);
  g.lineCap = 'round';
  let seed = 41;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 620; i++) {
    const x = rnd() * S,
      y = rnd() * S,
      a = rnd() * Math.PI * 2;
    const len = 3 + Math.pow(rnd(), 1.6) * 18,
      bend = (rnd() - 0.5) * len * 0.5;
    const light = rnd() < 0.66;
    g.strokeStyle = light
      ? 'rgba(232,226,198,' + (0.06 + rnd() * 0.13).toFixed(3) + ')'
      : 'rgba(12,18,7,' + (0.07 + rnd() * 0.14).toFixed(3) + ')';
    g.lineWidth = 0.45 + rnd() * 0.55;
    const dx = Math.cos(a) * len,
      dy = Math.sin(a) * len;
    const nx = -Math.sin(a) * bend,
      ny = Math.cos(a) * bend;
    for (const ox of [-S, 0, S]) {
      for (const oy of [-S, 0, S]) {
        const x0 = x + ox,
          y0 = y + oy;
        if (x0 + 24 < 0 || x0 - 24 > S || y0 + 24 < 0 || y0 - 24 > S) continue;
        g.beginPath();
        g.moveTo(x0, y0);
        g.quadraticCurveTo(
          x0 + dx / 2 + nx,
          y0 + dy / 2 + ny,
          x0 + dx,
          y0 + dy
        );
        g.stroke();
      }
    }
  }
  fiberCache = c.toDataURL('image/png');
  return fiberCache;
}

/** 왁스 씰의 불규칙한 가장자리 path */
function makeSealPath(): string {
  const n = 40;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r =
      43 +
      1.9 * Math.sin(a * 5 + 0.7) +
      1.3 * Math.sin(a * 9 + 2.1) +
      0.8 * Math.sin(a * 14 + 0.3) +
      (i % 7 === 3 ? 1.6 : 0);
    pts.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]);
  }
  const mid = (p: [number, number], q: [number, number]) =>
    ((p[0] + q[0]) / 2).toFixed(2) + ' ' + ((p[1] + q[1]) / 2).toFixed(2);
  let d = 'M' + mid(pts[n - 1], pts[0]);
  for (let i = 0; i < n; i++) {
    const p = pts[i],
      q = pts[(i + 1) % n];
    d += ' Q' + p[0].toFixed(2) + ' ' + p[1].toFixed(2) + ' ' + mid(p, q);
  }
  return d + 'Z';
}

/* ───────── 카드 앞면 (= 본문 cover 의 타이틀 블록과 동일한 모양) ───────── */

function CoverContent({
  groom,
  bride,
  groomKo,
  brideKo,
  dateText,
  dayText,
  kicker = 'The Wedding of'
}: CoverFace & { kicker?: string }) {
  return (
    <>
      <h1>
        <span className={`${styles.caps} ${styles.kicker}`}>{kicker}</span>
        <span className={styles.nm}>
          {groomKo}
          <span> · </span>
          {brideKo}
        </span>
      </h1>
      <p className={styles.namesKo}>초대합니다.</p>
      <p className={styles.coreDate}>
        {dateText}
        <b>{dayText}</b>
      </p>
    </>
  );
}

export interface CoverCoreProps extends CoverFace {
  kicker?: string;
  /** 추가로 붙일 클래스 (레이아웃용: margin 등) */
  className?: string;
}

/**
 * 본문 cover 에 놓는 타이틀 블록. 봉투 카드와 같은 크기·스타일이며,
 * ref 를 EnvelopeStage 의 coverTargetRef 로 넘기면 카드 글자가 이 자리로 안착합니다.
 */
export const CoverCore = forwardRef<HTMLDivElement, CoverCoreProps>(
  function CoverCore({ className, ...face }, ref) {
    return (
      <div
        ref={ref}
        className={className ? `${styles.core} ${className}` : styles.core}
      >
        <CoverContent {...face} />
      </div>
    );
  }
);

/* ───────── 메인 컴포넌트 ───────── */

const PETAL_COLORS: [string, string][] = [
  ['#FAF4E6', '#D8CBA8'],
  ['#CCD6B2', '#9FAD82'],
  ['#E9D8A8', '#BFA466']
];
const petalSvg = (fill: string, stroke: string) =>
  '<svg viewBox="0 0 20 27"><path d="M10 1 C16 6 18 15 13.5 23 C12 25.6 8 25.6 6.5 23 C2 15 4 6 10 1Z" fill="' +
  fill +
  '" stroke="' +
  stroke +
  '" stroke-width=".6"/><path d="M10 4 C10.5 10 10.4 16 9.6 22" fill="none" stroke="' +
  stroke +
  '" stroke-width=".5" opacity=".7"/></svg>';

export default function EnvelopeStage({
  groom = 'Hyun Joong',
  bride = 'Gun Hee',
  groomKo = constants.groom.name,
  brideKo = constants.bride.name,
  monogram = ['H', 'G'],
  year = '2027',
  dateText = '2027. 05. 01',
  dayText = '(토)',
  eyebrow = 'The Wedding Invitation',
  pocketText = 'with love',
  tapEn = 'Tap to open',
  tapKo = '봉투를 눌러 청첩장을 열어주세요',
  coverTargetRef,
  autoOpen = false,
  onOpenStart,
  onOpened,
  onClosed,
  onComplete
}: EnvelopeStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const flyCardRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const openedRef = useRef(false);

  const [steps, setSteps] = useState<Steps>({
    ready: false,
    s1: false,
    s2: false,
    s3: false,
    s5: false,
    done: false
  });
  const [flapBehind, setFlapBehind] = useState(false);
  const [fly, setFly] = useState<FlyState | null>(null);
  const [gone, setGone] = useState(false);
  const [fiberUrl, setFiberUrl] = useState<string | null>(null);

  const sealPath = useMemo(makeSealPath, []);
  const face: CoverFace = { groom, bride, groomKo, brideKo, dateText, dayText };

  /* 최신 props 를 타이머 콜백에서 쓰기 위한 ref */
  const latest = useRef<LatestProps>({ autoOpen });
  latest.current = {
    onOpenStart,
    onOpened,
    onClosed,
    coverTargetRef,
    autoOpen
  };

  const at = useCallback((t: number, f: () => void) => {
    timers.current.push(setTimeout(f, t));
  }, []);
  const addStep = useCallback(
    (k: keyof Steps) => setSteps((s) => ({ ...s, [k]: true })),
    []
  );

  /* 섬유 질감 */
  useEffect(() => {
    setFiberUrl(getFiberTexture());
  }, []);

  /* 열리기 전까지 스크롤 잠금 */
  useEffect(() => {
    if (steps.done) return undefined;
    const html = document.documentElement,
      body = document.body;
    const prev = [html.style.overflow, body.style.overflow];
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev[0];
      body.style.overflow = prev[1];
    };
  }, [steps.done]);

  /* 언마운트 시 타이머 정리 */
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    []
  );

  /* ── 꽃잎 ── */
  const petals = useCallback(() => {
    const layer = petalsRef.current,
      env = envelopeRef.current;
    if (!layer || !env) return;
    const lr = layer.getBoundingClientRect(),
      er = env.getBoundingClientRect();
    const W = lr.width,
      H = lr.height;
    const ox = er.left - lr.left + er.width / 2,
      oy = er.top - lr.top + er.height * 0.08;
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('span');
      el.className = styles.petal;
      const [fill, stroke] = PETAL_COLORS[i % 3];
      const s = 10 + Math.random() * 9;
      el.style.width = s + 'px';
      el.style.height = s * 1.35 + 'px';
      el.style.marginLeft = -s / 2 + 'px';
      el.style.marginTop = -s * 0.67 + 'px';
      el.innerHTML = petalSvg(fill, stroke);
      layer.appendChild(el);
      const x0 = ox + (Math.random() - 0.5) * er.width * 0.55,
        y0 = oy;
      const up = 60 + Math.random() * 120,
        dx = (Math.random() - 0.5) * W * 0.8;
      const fall = H * (0.22 + Math.random() * 0.22);
      const dur = 2900 + Math.random() * 900,
        delay = Math.random() * 450;
      const r0 = Math.random() * 360,
        spin = (Math.random() < 0.5 ? -1 : 1) * (90 + Math.random() * 180);
      const sway = 12 + Math.random() * 18,
        ph = Math.random() * 6.28,
        N = 14;
      const frames: Keyframe[] = [];
      for (let k = 0; k <= N; k++) {
        const p = k / N;
        let x: number, y: number;
        if (p <= 0.22) {
          const q = p / 0.22,
            e = 1 - Math.pow(1 - q, 2);
          x = x0 + dx * 0.35 * e;
          y = y0 - up * e;
        } else {
          const q = (p - 0.22) / 0.78,
            e = 1 - Math.pow(1 - q, 1.8);
          x =
            x0 +
            dx * 0.35 +
            dx * 0.65 * e +
            Math.sin(ph + q * 6) * sway * (1 - q * 0.5);
          y = y0 - up + fall * e;
        }
        frames.push({
          transform:
            'translate3d(' +
            x.toFixed(1) +
            'px,' +
            y.toFixed(1) +
            'px,0) rotate(' +
            (r0 + spin * p).toFixed(1) +
            'deg) rotateX(' +
            (Math.sin(ph + p * 9) * 55).toFixed(1) +
            'deg) rotateY(' +
            (Math.cos(ph + p * 6) * 40).toFixed(1) +
            'deg)',
          opacity:
            k === 0
              ? 0
              : p < 0.62
                ? 0.95
                : Math.max(0, 0.95 * (1 - (p - 0.62) / 0.38)),
          offset: p
        });
      }
      const anim = el.animate(frames, {
        duration: dur,
        delay,
        easing: 'linear',
        fill: 'both'
      });
      anim.onfinish = () => el.remove();
    }
  }, []);

  /* ── 카드가 화면 전체로 커지며 본문으로 이어지는 단계 ── */
  const expand = useCallback(() => {
    const stage = stageRef.current,
      card = cardRef.current,
      core = coreRef.current;
    if (!stage || !card || !core) return;
    const s = stage.getBoundingClientRect();
    const r = card.getBoundingClientRect();
    const c0 = core.getBoundingClientRect();
    const targetEl = latest.current.coverTargetRef?.current;
    let move: FlyState['move'] = null;
    if (targetEl) {
      const t = targetEl.getBoundingClientRect();
      move = {
        tx: t.left - c0.left,
        ty: t.top - c0.top,
        k: t.width / c0.width
      };
    }
    setFly({
      stageW: s.width,
      stageH: s.height,
      grow: false,
      move,
      card: {
        left: r.left - s.left,
        top: r.top - s.top,
        width: r.width,
        height: r.height
      },
      core: { left: c0.left - s.left, top: c0.top - s.top, width: c0.width }
    });
    addStep('s5');

    at(1200, () => {
      window.scrollTo(0, 0);
      addStep('done');
      latest.current.onOpened?.();
      at(700, () => latest.current.onClosed?.());
    });
  }, [at, addStep]);

  /* 처음 위치에서 한 프레임 그린 뒤 grow → CSS transition 이 걸리도록 */
  useIsoLayoutEffect(() => {
    if (!fly || fly.grow) return undefined;
    flyCardRef.current?.getBoundingClientRect(); // reflow
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setFly((f) => (f ? { ...f, grow: true } : f)))
    );
    return () => cancelAnimationFrame(id);
  }, [fly]);

  /* ── 봉투 열기 시퀀스 ── */
  const open = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    latest.current.onOpenStart?.();
    onComplete?.();
    addStep('s1'); //                          씰이 떨어짐
    at(360, () => addStep('s2')); //           플랩이 뒤로 접힘
    at(620, petals); //                        꽃잎
    at(880, () => setFlapBehind(true)); //     플랩이 90° 지나면 카드 뒤로
    at(1400, () => addStep('s3')); //          카드가 올라옴
    at(2750, expand); //                       카드가 본문으로 확장
    at(5300, () => setGone(true)); //          꽃잎까지 끝난 뒤 제거
  }, [at, addStep, petals, expand]);

  /* 폰트 로딩 후 인트로 등장 */
  useEffect(() => {
    let cancelled = false,
      fired = false;
    const ready = () => {
      if (cancelled || fired) return;
      fired = true;
      requestAnimationFrame(() => addStep('ready'));
      if (latest.current.autoOpen) at(1300, open);
    };
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(ready);
    const id = setTimeout(ready, 1500);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [at, addStep, open]);

  if (gone) return null;

  const stageClass = [
    styles.stage,
    styles.paper,
    ...(Object.keys(steps) as (keyof Steps)[])
      .filter((k) => steps[k])
      .map((k) => styles[k])
  ].join(' ');

  return (
    <div className={styles.root}>
      {/* 공유 SVG defs (그라디언트·코튼지 필터·안감 패턴) */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="ev-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#83652f" />
            <stop offset=".34" stopColor="#c2a66b" />
            <stop offset=".5" stopColor="#e4d29f" />
            <stop offset=".66" stopColor="#b0914f" />
            <stop offset="1" stopColor="#7d602c" />
          </linearGradient>
          <linearGradient id="ev-goldDeep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6c4f20" />
            <stop offset=".42" stopColor="#b3934c" />
            <stop offset=".54" stopColor="#dcc489" />
            <stop offset=".7" stopColor="#9e7f3c" />
            <stop offset="1" stopColor="#6c4f20" />
          </linearGradient>

          {/* cotton paper: soft mottling + fine isotropic grain (no directional streaks) */}
          <filter
            id="ev-cotton"
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".016"
              numOctaves="3"
              seed="23"
              result="m"
            />
            <feColorMatrix
              in="m"
              type="matrix"
              values="0 0 0 0 .07  0 0 0 0 .09  0 0 0 0 .04  -1.15 0 0 0 .55"
              result="stainD"
            />
            <feColorMatrix
              in="m"
              type="matrix"
              values="0 0 0 0 .86  0 0 0 0 .86  0 0 0 0 .72  .9 0 0 0 -.5"
              result="stainL"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.15"
              numOctaves="2"
              seed="7"
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 .92  0 0 0 0 .9  0 0 0 0 .8  .9 0 0 0 -.4"
              result="specks"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="2.3"
              numOctaves="1"
              seed="2"
              result="d"
            />
            <feColorMatrix
              in="d"
              type="matrix"
              values="0 0 0 0 .06  0 0 0 0 .08  0 0 0 0 .04  -1.1 0 0 0 .56"
              result="dark"
            />
            <feMerge>
              <feMergeNode in="stainD" />
              <feMergeNode in="stainL" />
              <feMergeNode in="dark" />
              <feMergeNode in="specks" />
            </feMerge>
          </filter>
          {/* fine cotton fibres scattered in every direction (tile drawn by script) */}
          <pattern
            id="ev-fibers"
            width="128"
            height="128"
            patternUnits="userSpaceOnUse"
          >
            <image
              href={fiberUrl ?? undefined}
              width="128"
              height="128"
              preserveAspectRatio="none"
            />
          </pattern>

          {/* ivory liner with fine-line wildflowers */}
          <pattern
            id="ev-liner"
            width="38"
            height="38"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-16)"
          >
            <rect width="38" height="38" fill="#F3EDDE" />
            <g
              fill="none"
              stroke="#5F6C48"
              strokeWidth=".42"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g transform="translate(4 3)">
                <path d="M3 16 C4.5 12 5.5 8.5 6 4.6" />
                <path d="M4.4 11.6 C2.6 11.2 1.6 9.8 1.7 8.2 C3.4 8.7 4.3 10 4.4 11.6Z" />
                <path d="M5.4 9 C7 8 8.6 8.2 9.6 9.3 C8 10.2 6.6 10 5.4 9Z" />
                <g transform="translate(6 3.2)">
                  <ellipse cy="-1.5" rx=".85" ry="1.45" />
                  <ellipse
                    cy="-1.5"
                    rx=".85"
                    ry="1.45"
                    transform="rotate(72)"
                  />
                  <ellipse
                    cy="-1.5"
                    rx=".85"
                    ry="1.45"
                    transform="rotate(144)"
                  />
                  <ellipse
                    cy="-1.5"
                    rx=".85"
                    ry="1.45"
                    transform="rotate(216)"
                  />
                  <ellipse
                    cy="-1.5"
                    rx=".85"
                    ry="1.45"
                    transform="rotate(288)"
                  />
                </g>
              </g>
              <g transform="translate(22 21) rotate(38)">
                <path d="M0 13 C1 9 1.4 5.5 1 2" />
                <path d="M1.2 8 C3 7 4.4 7.3 5.2 8.5 C3.6 9.2 2.2 9 1.2 8Z" />
                <path d="M1 2 C-.8 .8 -.6 -1.4 1 -2 C2.6 -1.4 2.8 .8 1 2Z" />
              </g>
              <path d="M30 6 C31 4.6 32.6 4 34 4.4 M30 6 C30.6 7.6 30.2 9 29 10" />
            </g>
            <circle cx="10" cy="6.2" r=".55" fill="#B39550" />
            <circle cx="12" cy="31" r=".5" fill="#B39550" />
          </pattern>
        </defs>
      </svg>

      <div
        ref={stageRef}
        className={stageClass}
        aria-label="청첩장 봉투"
        onClick={open}
      >
        <div className={`${styles.intro} ${styles.introTop}`}>
          <p className={styles.caps}>{eyebrow}</p>
          <p className={styles.introNames}>
            {groom}
            <span>&amp;</span>
            {bride}
          </p>
          <span className={styles.goldline} />
        </div>

        <div className={styles.envIn}>
          <div className={styles.envFloat}>
            <div
              ref={envelopeRef}
              className={styles.envelope}
              role="button"
              tabIndex={0}
              aria-label="봉투 열기"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  open();
                }
              }}
            >
              <div className={styles.envShadow} />

              {/* inside back panel */}
              <svg
                className={styles.envBack}
                viewBox="0 0 320 214"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="ev-inShade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1c2412" stopOpacity=".30" />
                    <stop offset=".45" stopColor="#1c2412" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect width="320" height="214" rx="2.5" fill="#3B4730" />
                <rect
                  x="8"
                  y="6"
                  width="304"
                  height="202"
                  fill="url(#ev-liner)"
                />
                <rect
                  x="8"
                  y="6"
                  width="304"
                  height="202"
                  fill="url(#ev-inShade)"
                />
              </svg>

              <div
                ref={cardRef}
                className={styles.card}
                style={fly ? { visibility: 'hidden' } : undefined}
              >
                <div
                  ref={coreRef}
                  className={styles.core}
                  aria-hidden="true"
                  style={fly ? { visibility: 'hidden' } : undefined}
                >
                  <CoverContent {...face} />
                </div>
              </div>

              {/* front pocket */}
              <svg
                className={styles.envFront}
                viewBox="0 0 320 214"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="ev-sideL" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#46533A" />
                    <stop offset="1" stopColor="#37432C" />
                  </linearGradient>
                  <linearGradient id="ev-sideR" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0" stopColor="#46533A" />
                    <stop offset="1" stopColor="#37432C" />
                  </linearGradient>
                  <linearGradient id="ev-bot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#4C5940" />
                    <stop offset="1" stopColor="#404D35" />
                  </linearGradient>
                  <filter
                    id="ev-foldSh"
                    x="-10%"
                    y="-30%"
                    width="120%"
                    height="150%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="-1.4"
                      stdDeviation="2.2"
                      floodColor="#141a0c"
                      floodOpacity=".42"
                    />
                  </filter>
                  <clipPath id="ev-pocketClip">
                    <path d="M0 0 L160 124 L0 214Z" />
                    <path d="M320 0 L160 124 L320 214Z" />
                  </clipPath>
                  <clipPath id="ev-botClip">
                    <path d="M0 214 L146 117 Q160 108 174 117 L320 214Z" />
                  </clipPath>
                </defs>
                <path d="M0 0 L160 124 L0 214Z" fill="url(#ev-sideL)" />
                <path d="M320 0 L160 124 L320 214Z" fill="url(#ev-sideR)" />
                <rect
                  width="320"
                  height="214"
                  filter="url(#ev-cotton)"
                  clipPath="url(#ev-pocketClip)"
                  opacity=".5"
                />
                <rect
                  width="320"
                  height="214"
                  fill="url(#ev-fibers)"
                  clipPath="url(#ev-pocketClip)"
                />
                <g filter="url(#ev-foldSh)">
                  <path
                    d="M0 214 L146 117 Q160 108 174 117 L320 214Z"
                    fill="url(#ev-bot)"
                  />
                </g>
                <rect
                  width="320"
                  height="214"
                  filter="url(#ev-cotton)"
                  clipPath="url(#ev-botClip)"
                  opacity=".5"
                />
                <rect
                  x="7"
                  y="9"
                  width="320"
                  height="214"
                  fill="url(#ev-fibers)"
                  clipPath="url(#ev-botClip)"
                />
                {/* fold edges catching light */}
                <path
                  d="M1 213 L146 117 Q160 108 174 117 L319 213"
                  fill="none"
                  stroke="#F4ECD2"
                  strokeOpacity=".16"
                  strokeWidth=".7"
                />
                <text
                  x="160"
                  y="186"
                  textAnchor="middle"
                  fontFamily="Pinyon Script, cursive"
                  fontSize="15"
                  fill="url(#ev-gold)"
                >
                  {pocketText}
                </text>
                <path
                  d="M134 194 H186"
                  stroke="url(#ev-gold)"
                  strokeWidth=".5"
                  opacity=".7"
                />
              </svg>

              <div
                className={styles.flap}
                style={flapBehind ? { zIndex: 1 } : undefined}
                aria-hidden="true"
              >
                <div className={`${styles.face} ${styles.front}`}>
                  <svg viewBox="0 0 320 124" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ev-flapG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#3E4A32" />
                        <stop offset="1" stopColor="#48553C" />
                      </linearGradient>
                      <clipPath id="ev-flapClip">
                        <path d="M0 0 H320 L171 118 Q160 127 149 118 Z" />
                      </clipPath>
                    </defs>
                    <path
                      d="M0 0 H320 L171 118 Q160 127 149 118 Z"
                      fill="url(#ev-flapG)"
                    />
                    <rect
                      width="320"
                      height="124"
                      filter="url(#ev-cotton)"
                      clipPath="url(#ev-flapClip)"
                      opacity=".5"
                    />
                    <rect
                      x="-31"
                      y="-17"
                      width="360"
                      height="150"
                      fill="url(#ev-fibers)"
                      clipPath="url(#ev-flapClip)"
                    />
                    <path
                      d="M1 1 L149 118 Q160 127 171 118 L319 1"
                      fill="none"
                      stroke="#F4ECD2"
                      strokeOpacity=".14"
                      strokeWidth=".7"
                    />
                  </svg>
                </div>
                <div className={`${styles.face} ${styles.back}`}>
                  <svg viewBox="0 0 320 124" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ev-hinge" x1="0" y1="1" x2="0" y2="0">
                        <stop
                          offset="0"
                          stopColor="#1c2412"
                          stopOpacity=".22"
                        />
                        <stop offset=".3" stopColor="#1c2412" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 124 H320 L171 6 Q160 -3 149 6 Z"
                      fill="#3E4A32"
                    />
                    <path
                      d="M10 124 H310 L168 14.5 Q160 8 152 14.5 Z"
                      fill="url(#ev-liner)"
                    />
                    <path
                      d="M10 124 H310 L168 14.5 Q160 8 152 14.5 Z"
                      fill="url(#ev-hinge)"
                    />
                  </svg>
                </div>
              </div>

              <div className={styles.seal} aria-hidden="true">
                <svg viewBox="0 0 100 100">
                  <defs>
                    <radialGradient id="ev-wax" cx="36%" cy="30%" r="80%">
                      <stop offset="0" stopColor="#FFFAEE" />
                      <stop offset=".42" stopColor="#F1E6CD" />
                      <stop offset=".82" stopColor="#DDCCA7" />
                      <stop offset="1" stopColor="#C8B48B" />
                    </radialGradient>
                    <radialGradient id="ev-waxIn" cx="64%" cy="70%" r="74%">
                      <stop offset="0" stopColor="#F6EDD8" />
                      <stop offset=".7" stopColor="#E7D9BA" />
                      <stop offset="1" stopColor="#D3C09A" />
                    </radialGradient>
                    <filter
                      id="ev-sealSh"
                      x="-30%"
                      y="-30%"
                      width="160%"
                      height="160%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="2.6"
                        stdDeviation="2.4"
                        floodColor="#0f1409"
                        floodOpacity=".5"
                      />
                    </filter>
                    <filter
                      id="ev-emb"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feDropShadow
                        dx="0"
                        dy=".7"
                        stdDeviation=".35"
                        floodColor="#5b4520"
                        floodOpacity=".55"
                      />
                    </filter>
                  </defs>
                  <path
                    d={sealPath}
                    fill="url(#ev-wax)"
                    filter="url(#ev-sealSh)"
                  />
                  <path
                    d={sealPath}
                    transform="translate(50 50) scale(.93) translate(-50 -50)"
                    fill="none"
                    stroke="#fffdf6"
                    strokeOpacity=".55"
                    strokeWidth=".8"
                  />
                  <circle cx="50" cy="50" r="31" fill="url(#ev-waxIn)" />
                  <circle
                    cx="50"
                    cy="50"
                    r="31"
                    fill="none"
                    stroke="#9c8659"
                    strokeOpacity=".55"
                    strokeWidth="1.3"
                  />
                  <circle
                    cx="50"
                    cy="50.9"
                    r="31.5"
                    fill="none"
                    stroke="#fffaf0"
                    strokeOpacity=".8"
                    strokeWidth=".8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="27"
                    fill="none"
                    stroke="url(#ev-goldDeep)"
                    strokeWidth=".6"
                  />
                  <g filter="url(#ev-emb)">
                    <text
                      x="50"
                      y="56.5"
                      textAnchor="middle"
                      className={styles.sealTxt}
                    >
                      {monogram[0]}
                      <tspan className={styles.amp} dy="-4" dx="1">
                        &amp;
                      </tspan>
                      <tspan dy="4" dx="1">
                        {monogram[1]}
                      </tspan>
                    </text>
                    <text
                      x="50.8"
                      y="69.5"
                      textAnchor="middle"
                      className={styles.sealYr}
                    >
                      {year}
                    </text>
                    <path
                      d="M38 34.5 C44 31.5 56 31.5 62 34.5"
                      fill="none"
                      stroke="url(#ev-goldDeep)"
                      strokeWidth=".75"
                      strokeLinecap="round"
                    />
                  </g>
                  <ellipse
                    cx="36"
                    cy="28"
                    rx="13"
                    ry="5.5"
                    fill="#fff"
                    opacity=".35"
                    transform="rotate(-32 36 28)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.intro} ${styles.introBottom}`}>
          <p className={styles.tapEn}>{tapEn}</p>
          <p className={styles.tapKo}>{tapKo}</p>
        </div>

        {/* 확장 단계: 봉투의 transform 컨텍스트 밖으로 꺼내기 위해 stage 직속으로 포털 렌더 */}
        {fly &&
          stageRef.current &&
          createPortal(
            <>
              <div
                ref={flyCardRef}
                className={`${styles.card} ${styles.flying}${fly.grow ? ` ${styles.grow}` : ''}`}
                style={
                  fly.grow
                    ? { left: 0, top: 0, width: fly.stageW, height: fly.stageH }
                    : {
                        left: fly.card.left,
                        top: fly.card.top,
                        width: fly.card.width,
                        height: fly.card.height
                      }
                }
              />
              <div
                className={`${styles.core} ${styles.flyingCore}${fly.grow ? ` ${styles.go}` : ''}`}
                aria-hidden="true"
                style={{
                  left: fly.core.left,
                  top: fly.core.top,
                  width: fly.core.width,
                  transform:
                    fly.grow && fly.move
                      ? `translate(${fly.move.tx}px, ${fly.move.ty}px) scale(${fly.move.k})`
                      : 'none'
                }}
              >
                <CoverContent {...face} />
              </div>
            </>,
            stageRef.current
          )}
      </div>

      <div ref={petalsRef} className={styles.petals} aria-hidden="true" />
    </div>
  );
}
