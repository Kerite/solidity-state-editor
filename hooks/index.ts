import { useRef, useEffect, EffectCallback, DependencyList } from "react";

export const useUpdataEffect = (effect: EffectCallback, deps: DependencyList) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      return effect();
    }
  }, deps);
};
