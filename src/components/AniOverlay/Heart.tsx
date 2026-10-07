import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  color: string;
}

interface HeartParticleCanvasProps {
  count?: number;
  color?: string | string[];
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  gravity?: number;
  opacity?: number;
  className?: string;
}

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const randomItem = <T,>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

/**
 * 원본 tsParticles의 heart shape를 그대로 재현
 *
 * 원본:
 * moveTo()
 * quadraticCurveTo()
 * lineTo()
 */
function drawHeart(ctx: CanvasRenderingContext2D, radius: number) {
  const size = 2 * radius;

  const half = 0.5 * radius;
  const radiusPlusHalf = radius + half;

  const x = -radius;
  const y = -radius;

  ctx.moveTo(x, y + half);

  ctx.quadraticCurveTo(x, y, x + half, y);

  ctx.quadraticCurveTo(x + radius, y, x + radius, y + half);

  ctx.quadraticCurveTo(x + radius, y, x + radiusPlusHalf, y);

  ctx.quadraticCurveTo(x + size, y, x + size, y + half);

  ctx.quadraticCurveTo(
    x + size,
    y + radius,
    x + radiusPlusHalf,
    y + radiusPlusHalf
  );

  ctx.lineTo(x + radius, y + size);

  ctx.lineTo(x + half, y + radiusPlusHalf);

  ctx.quadraticCurveTo(x, y + radius, x, y + half);
}

function createParticle(
  width: number,
  height: number,
  minSize: number,
  maxSize: number,
  minSpeed: number,
  maxSpeed: number,
  opacity: number,
  colors: string[]
): Particle {
  return {
    x: random(0, width),
    y: random(-height, height),
    vx: random(-0.3, 0.3),
    vy: random(minSpeed, maxSpeed),
    size: random(minSize, maxSize),
    opacity: random(opacity * 0.5, opacity),
    rotation: random(0, Math.PI * 2),
    rotationSpeed: random(-0.02, 0.02),
    scale: random(0.8, 1.2),
    color: randomItem(colors)
  };
}

export function Heart({
  count = 35,
  color = ['#f8b4c4', '#f4a6ba', '#ffffff'],
  minSize = 3,
  maxSize = 6,
  minSpeed = 0.2,
  maxSpeed = 1.0,
  gravity = 0.005,
  opacity = 0.8,
  className = ''
}: HeartParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    let animationFrameId = 0;

    let width = 0;
    let height = 0;

    let particles: Particle[] = [];

    const colors = Array.isArray(color) ? color : [color];

    /**
     * Canvas 크기 조절
     *
     * devicePixelRatio를 적용해서
     * 모바일 Retina 화면에서도 선명하게 렌더링
     */
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, () =>
        createParticle(
          width,
          height,
          minSize,
          maxSize,
          minSpeed,
          maxSpeed,
          opacity,
          colors
        )
      );
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);

    /**
     * Particle 업데이트
     */
    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vy += gravity;

      particle.rotation += particle.rotationSpeed;

      /**
       * 좌우 영역을 벗어나면 반대쪽으로 이동
       */
      if (particle.x < -20) {
        particle.x = width + 20;
      }

      if (particle.x > width + 20) {
        particle.x = -20;
      }

      /**
       * 화면 아래로 나가면
       * 위에서 다시 등장
       */
      if (particle.y > height + particle.size * 2) {
        particle.y = -particle.size * 2;

        particle.x = random(0, width);

        particle.vy = random(minSpeed, maxSpeed);

        particle.vx = random(-0.3, 0.3);
      }
    };

    /**
     * Particle 하나 그리기
     */
    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.scale(particle.scale, particle.scale);
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      drawHeart(ctx, particle.size);
      ctx.fill();
      ctx.restore();
    };

    /**
     * Animation loop
     *
     * 원본의
     *
     * particles.draw(delta)
     * animationStatus && draw()
     *
     * 구조를 단순화한 부분
     */
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        updateParticle(particle);
        drawParticle(particle);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);

      resizeObserver.disconnect();

      ctx.clearRect(0, 0, width, height);
    };
  }, [count, color, minSize, maxSize, minSpeed, maxSpeed, gravity, opacity]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />
    </div>
  );
}
