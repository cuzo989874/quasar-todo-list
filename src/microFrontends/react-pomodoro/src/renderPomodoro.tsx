import React from 'react';
import { createRoot } from 'react-dom/client';
import Pomodoro from './pomodoro';

let root: ReturnType<typeof createRoot> | null = null;

export const mount = (el: HTMLElement) => {
  root = createRoot(el);
  root.render(<Pomodoro />);

  // 回傳卸載函數
  return () => {
    if (root) {
      root.unmount();
      root = null;
    }
  };
};
