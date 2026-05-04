'use client';
import { useEffect, useRef } from 'react';

export default function ScrollReveal({ children, delay = 0, className = '', style = {} }) {
  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Double rAF: guarantees the browser paints the initial opacity:0 state
    // before the IntersectionObserver can fire. Without this, fast hydration
    // or client-side navigation makes the observer trigger immediately,
    // skipping the transition entirely.
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
              observerRef.current?.unobserve(el);
            }
          },
          { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
        );
        observerRef.current.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(24px)',
        willChange: 'opacity, transform',
        transition: `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
