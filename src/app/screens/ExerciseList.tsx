import { useExerciseActions } from '@app/hooks/useExerciseActions';
import { filteredExercisesAtom, progressAtom, screenAtom, searchActiveAtom } from '@app/store';
import { Select } from '@components/Select';
import { TextInput } from '@components/TextInput';
import { DifficultyBadge, formatDate, KeyHints, Stats } from '@components/ui';
import type { Exercise } from '@exercises/types';
import type { ExerciseStat } from '@utils/state';
import { Box, Text, useInput } from 'ink';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

const LABEL_WIDTH = 35;

function padLabel(name: string): string {
  const short = name.length > LABEL_WIDTH - 1 ? `${name.slice(0, LABEL_WIDTH - 2)}…` : name;
  return short.padEnd(LABEL_WIDTH);
}

function solvedMarker(stat?: ExerciseStat): string {
  return stat?.solves ? '✓ ' : '  ';
}

export function ExerciseList() {
  const exercises = useAtomValue(filteredExercisesAtom);
  const progress = useAtomValue(progressAtom);
  const setSearchActive = useSetAtom(searchActiveAtom);
  const setScreen = useSetAtom(screenAtom);
  const { openExercise } = useExerciseActions();

  const [highlighted, setHighlighted] = useState<Exercise>(exercises[0]);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setSearchActive(searching);
    return () => setSearchActive(false);
  }, [searching, setSearchActive]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? exercises.filter((e) => e.name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q))
    : exercises;
  const highlightedNote = progress.exercises[highlighted.id]?.note;

  const exitSearch = () => {
    setSearching(false);
    setQuery('');
  };

  useInput((input, key) => {
    if (searching) {
      return;
    }
    if (key.escape) {
      setScreen('difficulty');
    }
    if (input === '/') {
      setQuery('');
      setSearching(true);
    }
  });

  const title = searching
    ? `SELECT EXERCISE (${filtered.length}/${exercises.length})`
    : `SELECT EXERCISE (${exercises.length})`;

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Text color="cyanBright" bold>
        {title}
      </Text>

      {searching ? (
        <Box marginTop={1}>
          <Text color="yellowBright">/ </Text>
          <TextInput
            value={query}
            onChange={setQuery}
            onSubmit={() => {
              if (filtered.length > 0) {
                void openExercise(filtered[0]);
              }
            }}
            onCancel={exitSearch}
            placeholder="filter by name or type"
          />
        </Box>
      ) : null}

      <Box marginTop={1}>
        <Box flexDirection="column" width={60} flexShrink={0}>
          {filtered.length === 0 ? (
            <Text dimColor>no exercises match “{query}”</Text>
          ) : (
            <Select<Exercise>
              key={searching ? query : 'all'}
              items={filtered.map((e) => ({
                key: e.id,
                label: padLabel(e.name),
                value: e,
                leading: solvedMarker(progress.exercises[e.id]),
                leadingColor: 'greenBright',
                hint: `${e.difficulty} · ${e.time}`,
              }))}
              onSelect={(e) => void openExercise(e)}
              onHighlight={(e) => setHighlighted(e)}
              isActive={!searching}
            />
          )}
        </Box>
        <Box flexDirection="column" marginLeft={2} flexGrow={1}>
          {filtered.length === 0 ? (
            <Box borderStyle="round" borderColor="gray" paddingX={1} flexDirection="column">
              <Text dimColor>No exercises match your search.</Text>
            </Box>
          ) : (
            <Box borderStyle="round" borderColor="gray" paddingX={1} flexDirection="column">
              <Text bold color="whiteBright">
                {highlighted.name}
              </Text>
              <Box marginTop={1}>
                <DifficultyBadge difficulty={highlighted.difficulty} />
                <Text dimColor>{`  ${highlighted.type}`}</Text>
              </Box>
              <Box marginTop={1}>
                <Text dimColor>added: {formatDate(highlighted.createdAt)}</Text>
              </Box>
              {highlightedNote ? (
                <Box marginTop={1}>
                  <Text wrap="wrap">
                    <Text dimColor>note: </Text>
                    <Text color="magentaBright">{highlightedNote}</Text>
                  </Text>
                </Box>
              ) : null}
              <Box marginTop={1}>
                <Stats stat={progress.exercises[highlighted.id]} />
              </Box>
              <Box marginTop={1}>
                <Text wrap="wrap" dimColor>
                  {highlighted.description}
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box marginTop={1}>
        <KeyHints
          hints={[
            ['j/k ↑↓', 'navigate'],
            ['/', 'search'],
            ['gg/G', 'first/last'],
            ['↵', 'open'],
            ['esc', 'back'],
            ['q', 'quit'],
          ]}
        />
      </Box>
    </Box>
  );
}
