"use client";
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";

import "./DotGrid.scss";

gsap.registerPlugin(InertiaPlugin);

const throttle = (func: (...args: any[]) => void, limit: number) => {
  let lastCall = 0;
  return function (this: any, ...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _inertiaApplied: boolean;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 16,
  gap = 32,
  baseColor = "#5227FF",
  activeColor = "#5227FF",
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
    layoutX: 0,
    layoutY: 0,
    lastLayoutX: 0,
    lastLayoutY: 0,
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === "undefined" || !window.Path2D) return null;

    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // Prefer to size the grid layout to the nearest layout container if available
    // so the dots are positioned across the full scrollable area (scrollWidth/scrollHeight).
    // The canvas itself will be sized to the visible CSS pixels (cssW/cssH) while
    // drawing will be offset by the container's scroll position.
    const containerEl = (wrap.closest &&
      wrap.closest(".container")) as HTMLElement | null;
    const targetEl = containerEl ?? wrap;
    const { width: cssWidth, height: cssHeight } =
      targetEl.getBoundingClientRect();

    // visible canvas size (CSS pixels)
    const cssW = Math.round(cssWidth);
    const cssH = Math.round(cssHeight);
    canvas.width = cssW;
    canvas.height = cssH;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    // layout width/height across which dots are placed (covers overflow)
    const layoutW = Math.max(targetEl.scrollWidth || cssWidth, cssW);
    const layoutH = Math.max(targetEl.scrollHeight || cssHeight, cssH);

    const cols = Math.floor((layoutW + gap) / (dotSize + gap));
    const rows = Math.floor((layoutH + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = layoutW - gridW;
    const extraY = layoutH - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;

    let rafId: number;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // clear the full canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // apply rounded-rect clipping based on the wrapper's computed border-radius
      // so drawing never escapes the visual rounded container even if the canvas
      // itself is larger or transformed.
      const wrap = wrapperRef.current;
      let borderRadius = 0;
      if (wrap) {
        const cs = window.getComputedStyle(wrap);
        const br =
          cs.borderRadius || cs.getPropertyValue("border-radius") || "";
        // br is usually like '12px' or '12px 12px 12px 12px'. Use the first numeric value.
        const m = br.match(/([0-9]+(?:\.[0-9]+)?)/);
        if (m) borderRadius = parseFloat(m[1]);
      }

      // If there is a borderRadius, create a rounded rect path in canvas pixels and clip
      if (borderRadius > 0) {
        ctx.save();
        const w = canvas.width;
        const h = canvas.height;
        const r = Math.max(0, Math.min(borderRadius, Math.min(w, h) / 2));
        // rounded rect path
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        ctx.quadraticCurveTo(w, 0, w, r);
        ctx.lineTo(w, h - r);
        ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(r, h);
        ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.clip();
      }

      // pointer in canvas visible coords
      const { x: px, y: py } = pointerRef.current;

      // determine scroll offset of the layout target so we can draw the
      // visible slice of the full layout grid. If grid was built for a
      // container, use its scroll offsets.
      const wrapEl = wrapperRef.current;
      const containerEl = (wrapEl &&
        wrapEl.closest &&
        wrapEl.closest(".container")) as HTMLElement | null;
      const scrollLeft = containerEl
        ? containerEl.scrollLeft
        : wrapEl
        ? wrapEl.scrollLeft
        : 0;
      const scrollTop = containerEl
        ? containerEl.scrollTop
        : wrapEl
        ? wrapEl.scrollTop
        : 0;

      for (const dot of dotsRef.current) {
        // dot.cx/cy are in layout coordinates; offset them by scroll to get
        // canvas (visible) coordinates
        const ox = dot.cx + dot.xOffset - scrollLeft;
        const oy = dot.cy + dot.yOffset - scrollTop;
        // pointer layout coordinates for distance calculations
        const layoutPx = px + scrollLeft;
        const layoutPy = py + scrollTop;
        const dx = dot.cx - layoutPx;
        const dy = dot.cy - layoutPy;
        const dsq = dx * dx + dy * dy;

        let style = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          style = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(circlePath);
        ctx.restore();
      }
      rafId = requestAnimationFrame(draw);

      // if we applied a clip we need to restore the context after frame drawing
      if (borderRadius > 0) {
        ctx.restore();
      }
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

  useEffect(() => {
    buildGrid();
    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(buildGrid);
      const wrap = wrapperRef.current;
      const containerEl = (wrap &&
        wrap.closest &&
        wrap.closest(".container")) as HTMLElement | null;
      const observeTarget = containerEl ?? wrap;
      observeTarget && ro.observe(observeTarget);
    } else {
      (window as Window).addEventListener("resize", buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", buildGrid);
    };
  }, [buildGrid]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvasRef.current!.getBoundingClientRect();
      // store pointer in canvas visible coords
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;
      // also store pointer in layout coordinates if container scrolls
      const wrapEl = wrapperRef.current;
      const containerEl = (wrapEl &&
        wrapEl.closest &&
        wrapEl.closest(".container")) as HTMLElement | null;
      const scrollLeft = containerEl
        ? containerEl.scrollLeft
        : wrapEl
        ? wrapEl.scrollLeft
        : 0;
      const scrollTop = containerEl
        ? containerEl.scrollTop
        : wrapEl
        ? wrapEl.scrollTop
        : 0;
      // convert to layout coords for velocity-based pushes
      pr.lastLayoutX = pr.lastLayoutX ?? e.clientX - rect.left + scrollLeft;
      pr.lastLayoutY = pr.lastLayoutY ?? e.clientY - rect.top + scrollTop;
      pr.layoutX = e.clientX - rect.left + scrollLeft;
      pr.layoutY = e.clientY - rect.top + scrollTop;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.layoutX, dot.cy - pr.layoutY);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          // compute push in layout coords
          const pushX = dot.cx - pr.layoutX + vx * 0.005;
          const pushY = dot.cy - pr.layoutY + vy * 0.005;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const wrapEl = wrapperRef.current;
      const containerEl = (wrapEl &&
        wrapEl.closest &&
        wrapEl.closest(".container")) as HTMLElement | null;
      const scrollLeft = containerEl
        ? containerEl.scrollLeft
        : wrapEl
        ? wrapEl.scrollLeft
        : 0;
      const scrollTop = containerEl
        ? containerEl.scrollTop
        : wrapEl
        ? wrapEl.scrollTop
        : 0;
      const layoutCx = e.clientX - rect.left + scrollLeft;
      const layoutCy = e.clientY - rect.top + scrollTop;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - layoutCx, dot.cy - layoutCy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.cx - layoutCx) * shockStrength * falloff;
          const pushY = (dot.cy - layoutCy) * shockStrength * falloff;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const throttledMove = throttle(onMove, 50);
    window.addEventListener("mousemove", throttledMove, { passive: true });
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", throttledMove);
      window.removeEventListener("click", onClick);
    };
  }, [
    maxSpeed,
    speedTrigger,
    proximity,
    resistance,
    returnDuration,
    shockRadius,
    shockStrength,
  ]);

  return (
    <section className={`dot-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </section>
  );
};

export default DotGrid;
