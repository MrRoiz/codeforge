import { type Config, defaultExercisesDir, loadConfig, resolveExercisesDir } from '@utils/config';
import { atom } from 'jotai';

export const configAtom = atom<Config>(loadConfig());

/** The effective exercises directory (env > saved config > default). */
export const exercisesDirAtom = atom((get) => resolveExercisesDir(get(configAtom)));

export const defaultDirAtom = atom(() => defaultExercisesDir());
