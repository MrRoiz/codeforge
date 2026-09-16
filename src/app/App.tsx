import { Layout } from '@app/Layout';
import { DifficultyMenu } from '@app/screens/DifficultyMenu';
import { ExerciseList } from '@app/screens/ExerciseList';
import { ExerciseView } from '@app/screens/ExerciseView';
import { MainMenu } from '@app/screens/MainMenu';
import { ResultsView } from '@app/screens/ResultsView';
import { RunningView } from '@app/screens/RunningView';
import { SettingsView } from '@app/screens/SettingsView';
import { screenAtom } from '@app/state';
import { ErrorBanner } from '@components/ErrorBanner';
import { GlobalKeys } from '@components/GlobalKeys';
import { useAtomValue } from 'jotai';

/**
 * The app shell: frame, global shortcuts and the error banner. Each screen owns
 * its own state via atoms, so the router only has to pick one.
 */
export function App() {
  const screen = useAtomValue(screenAtom);

  return (
    <Layout>
      <ErrorBanner />
      <GlobalKeys />

      {screen === 'menu' ? <MainMenu /> : null}
      {screen === 'settings' ? <SettingsView /> : null}
      {screen === 'difficulty' ? <DifficultyMenu /> : null}
      {screen === 'list' ? <ExerciseList /> : null}
      {screen === 'exercise' ? <ExerciseView /> : null}
      {screen === 'running' ? <RunningView /> : null}
      {screen === 'results' ? <ResultsView /> : null}
    </Layout>
  );
}
