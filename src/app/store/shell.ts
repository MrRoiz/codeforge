import { atom } from 'jotai';

/** App-level error, rendered by the banner under the logo. */
export const errorAtom = atom<string | null>(null);

/** A one-line note shown on the main menu (e.g. after saving settings). */
export const statusAtom = atom<string | undefined>(undefined);

/** True while a screen is capturing text (settings, search) — gates global keys. */
export const searchActiveAtom = atom(false);

/** True while the main menu asks for confirmation before resetting everything. */
export const resetConfirmAtom = atom(false);
