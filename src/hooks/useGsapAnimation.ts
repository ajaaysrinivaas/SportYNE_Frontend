// hooks/useGsapAnimation.ts
import { useEffect } from "react";
import { gsap } from "gsap";

interface GsapRefs {
  breadcrumb?: React.RefObject<HTMLElement | null>;
  hero?: React.RefObject<HTMLElement | null>;
  content?: React.RefObject<HTMLElement | null>;
  scrollBtn?: React.RefObject<HTMLElement | null>;
}

export const useGsapAnimation = (refs: GsapRefs) => {
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power1.out" } });
    if (refs.breadcrumb?.current) {
      tl.fromTo(refs.breadcrumb.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0 });
    }
    if (refs.hero?.current) {
      tl.fromTo(refs.hero.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, "-=0.3");
    }
    if (refs.content?.current) {
      tl.fromTo(refs.content.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, "-=0.3");
    }
    if (refs.scrollBtn?.current) {
      tl.fromTo(refs.scrollBtn.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1 }, "-=0.3");
    }
    return () => {
      tl.kill();
    };
  }, [refs.breadcrumb, refs.hero, refs.content, refs.scrollBtn]);
};
