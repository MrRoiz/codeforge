import { useElapsed } from '@app/hooks/useElapsed';
import { useExerciseActions } from '@app/hooks/useExerciseActions';
import {
  appStateAtom,
  confirmAtom,
  elapsedMsAtom,
  exerciseAtom,
  hasContentAtom,
  pathsAtom,
  screenAtom,
  searchActiveAtom,
  startedAtAtom,
  startedAtom,
} from '@app/store';
import { ExerciseDetails, ExerciseHeader, ExerciseStatus } from '@components/exercise';
import { TextInput } from '@components/TextInput';
import { ConfirmPrompt, KeyHints } from '@components/ui';
import { backupsDirLabel, MAX_NOTE_LENGTH } from '@utils/state';
import { Box, Text, useInput } from 'ink';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

export function ExerciseView() {
  const exercise = useAtomValue(exerciseAtom);
  const paths = useAtomValue(pathsAtom);
  const started = useAtomValue(startedAtom);
  const startedAt = useAtomValue(startedAtAtom);
  const elapsedMs = useAtomValue(elapsedMsAtom);
  const hasContent = useAtomValue(hasContentAtom);
  const confirm = useAtomValue(confirmAtom);
  const state = useAtomValue(appStateAtom);
  const setScreen = useSetAtom(screenAtom);
  const setSearchActive = useSetAtom(searchActiveAtom);
  const actions = useExerciseActions();

  const [showHints, setShowHints] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  const liveElapsed = useElapsed(startedAt);
  const running = startedAt !== null;
  // a stopped clock with a recorded time means the exercise was just solved
  const finished = !running && elapsedMs != null;
  const elapsed = running ? liveElapsed : (elapsedMs ?? 0);
  const confirmingReset = confirm === 'solution';
  const confirmingResetExercise = confirm === 'exercise';
  const confirming = confirmingReset || confirmingResetExercise;
  const note = exercise ? state.exercises[exercise.id]?.note : undefined;
  const noteAtLimit = noteDraft.length >= MAX_NOTE_LENGTH;
  const backupDir = backupsDirLabel();

  // While typing, let TextInput own the keyboard: block the app-wide `q`/`p`
  // shortcuts, exactly like the exercise-list search does.
  useEffect(() => {
    setSearchActive(editingNote);
    return () => setSearchActive(false);
  }, [editingNote, setSearchActive]);

  const openNoteEditor = () => {
    // a note is one line and capped; collapse any stray whitespace/newlines
    setNoteDraft((note ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_NOTE_LENGTH));
    setEditingNote(true);
  };

  const submitNote = (value: string) => {
    actions.saveNote(value);
    setEditingNote(false);
  };

  useInput((input, key) => {
    if (!exercise) {
      return;
    }
    if (editingNote) {
      return;
    }
    if (confirmingReset) {
      if (input === 'y' || input === 'Y') {
        actions.answerReset('reset');
      } else if (input === 'n' || input === 'N' || key.escape) {
        actions.answerReset('cancel');
      }
      return;
    }
    if (confirmingResetExercise) {
      if (input === 'y' || input === 'Y') {
        actions.answerResetExercise('reset');
      } else if (input === 'n' || input === 'N' || key.escape) {
        actions.answerResetExercise('cancel');
      }
      return;
    }
    if (key.escape) {
      setScreen('list');
      return;
    }
    if (input === 's') {
      void actions.requestStart(exercise);
    }
    if (input === 't') {
      void actions.run(exercise);
    }
    if (input === 'o') {
      void actions.openEditor(exercise);
    }
    if (input === 'r' && started) {
      actions.restartTimer();
    }
    if (input === 'x') {
      actions.requestResetExercise();
    }
    if (input === 'n') {
      openNoteEditor();
    }
    if (input === 'h') {
      setShowHints((v) => !v);
    }
    if (input === 'c') {
      setShowTests((v) => !v);
    }
  });

  if (!exercise || !paths) {
    return null;
  }

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      flexShrink={1}
      minHeight={0}
      paddingLeft={2}
      paddingRight={2}
    >
      <ExerciseHeader exercise={exercise} stat={state.exercises[exercise.id]} note={note} />

      <ExerciseDetails exercise={exercise} showTests={showTests} showHints={showHints} />

      {editingNote ? (
        <Box
          marginTop={1}
          flexDirection="column"
          borderStyle="round"
          borderColor="magentaBright"
          paddingX={1}
          flexShrink={0}
        >
          <Text bold color="magentaBright">
            ✎ NOTE
          </Text>
          <Text dimColor>Saved with your progress. Enter to save, esc to cancel.</Text>
          <Box marginTop={1}>
            <TextInput
              value={noteDraft}
              onChange={setNoteDraft}
              onSubmit={submitNote}
              onCancel={() => setEditingNote(false)}
              placeholder="e.g. reuse the two-pointer window"
              maxLength={MAX_NOTE_LENGTH}
            />
          </Box>
          <Box>
            <Text color={noteAtLimit ? 'redBright' : 'cyan'} bold={noteAtLimit}>
              {noteDraft.length}/{MAX_NOTE_LENGTH}
            </Text>
          </Box>
          <Box marginTop={1}>
            <KeyHints
              hints={[
                ['type', 'write note'],
                ['←→', 'move cursor'],
                ['ctrl+u', 'clear'],
                ['↵', 'save'],
                ['esc', 'cancel'],
              ]}
            />
          </Box>
        </Box>
      ) : null}

      {confirmingReset ? (
        <ConfirmPrompt
          title="Reset the previous solution?"
          description="Starting the clock on existing work isn't allowed — exercise.ts will be replaced with the starter stub so you can solve it fresh."
          hints={[
            ['y', 'reset & start'],
            ['n / esc', 'cancel'],
          ]}
        />
      ) : null}

      {confirmingResetExercise ? (
        <ConfirmPrompt
          title="Reset this exercise?"
          description={`Removes its attempts, solves, best times and your note. Your solution file is left untouched. Your current progress is backed up to ${backupDir} first, so you can recover it.`}
          hints={[
            ['y', 'reset exercise'],
            ['n / esc', 'cancel'],
          ]}
        />
      ) : null}

      <ExerciseStatus
        started={started}
        running={running}
        finished={finished}
        elapsed={elapsed}
        exerciseFile={paths.exerciseFile}
        testFile={paths.testFile}
        hasContent={hasContent}
      />

      <Box marginTop={1} flexShrink={0}>
        {confirming || editingNote ? null : (
          <KeyHints
            hints={[
              ...(running || finished
                ? ([['r', 'restart timer']] as [string, string][])
                : ([['s', started ? 'start timer' : 'start']] as [string, string][])),
              ['t', 'run tests'],
              ['o', 'open in editor'],
              ['n', note ? 'edit note' : 'add note'],
              ...(state.exercises[exercise.id]?.attempts || note
                ? ([['x', 'reset exercise']] as [string, string][])
                : []),
              ['c', showTests ? 'hide tests' : 'show tests'],
              ['h', showHints ? 'hide hints' : 'show hints'],
              ['j/k', 'scroll'],
              ['esc', 'back'],
              ['q', 'quit'],
            ]}
          />
        )}
      </Box>
    </Box>
  );
}
