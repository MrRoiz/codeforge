import { confirmAtom, screenAtom, searchActiveAtom } from '@app/store';
import { openRepo } from '@utils/open';
import { useApp, useInput } from 'ink';
import { useAtomValue } from 'jotai';

/**
 * App-wide shortcuts that work on any screen: `q` quits and `p` opens the
 * project repo. Renders nothing — it only registers input handling, and stays
 * off while a screen is capturing text (settings, search, confirmations).
 */
export function GlobalKeys() {
  const { exit } = useApp();
  const screen = useAtomValue(screenAtom);
  const confirm = useAtomValue(confirmAtom);
  const searchActive = useAtomValue(searchActiveAtom);

  useInput(
    (input) => {
      if (input === 'q') {
        exit();
      }
      if (input === 'p') {
        openRepo();
      }
    },
    { isActive: screen !== 'settings' && !searchActive && !confirm },
  );

  return null;
}
