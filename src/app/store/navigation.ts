import { atom } from 'jotai';

/** Every top-level view the app can be on. */
export type Screen =
  | 'menu'
  | 'difficulty'
  | 'list'
  | 'exercise'
  | 'running'
  | 'results'
  | 'settings';

export const screenAtom = atom<Screen>('menu');
