import { loadState, type State } from '@utils/state';
import { atom } from 'jotai';

export const progressAtom = atom<State>(loadState());
