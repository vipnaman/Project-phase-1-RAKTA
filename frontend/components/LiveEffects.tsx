'use client';

import { useEffect, useState } from 'react';

type ClickEffect = {
  id: number;
  x: number;
  y: number;
};

type CursorPosition = {
  x: number;
  y: number;
};

export default function LiveEffects() {
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [cursor, setCursor] = useState<CursorPosition>({ x: -200, y: -200 });

  useEffect(() => {
    let nextId = 0;

    const handlePointerDown = (event: PointerEvent) => {
      const effect = { id: nextId++, x: event.clientX, y: event.clientY };
      setClickEffects((current) => [...current.slice(-5), effect]);
      window.setTimeout(() => {
        setClickEffects((current) => current.filter((item) => item.id !== effect.id));
      }, 700);
    };

    const handlePointerMove = (event: PointerEvent) => {
      setCursor({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div className="live-effects" aria-hidden="true">
      <div className="ambient-glow ambient-glow-one" />
      <div className="ambient-glow ambient-glow-two" />
      <div className="ambient-grid" />
      <div className="cursor-light" style={{ left: cursor.x, top: cursor.y }} />
      <div className="blood-particles">
        {Array.from({ length: 9 }, (_, index) => <span key={index} className={`blood-particle blood-particle-${index + 1}`} />)}
      </div>
      {clickEffects.map((effect) => (
        <span
          key={effect.id}
          className="click-ripple"
          style={{ left: effect.x, top: effect.y }}
        />
      ))}
    </div>
  );
}
