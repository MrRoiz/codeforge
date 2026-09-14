import { Box, Text, useInput } from 'ink';
import { useEffect, useState } from 'react';
import { Select } from '@components/Select';
import { TextInput } from '@components/TextInput';
import { DifficultyBadge, KeyHints } from '@components/ui';
import { validationLabel, type Exercise } from '@exercises/types';

interface Props {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  onBack: () => void;
  onSearchActive?: (active: boolean) => void;
}

const LABEL_WIDTH = 37;

function padLabel(name: string): string {
  const short = name.length > LABEL_WIDTH - 1 ? `${name.slice(0, LABEL_WIDTH - 2)}…` : name;
  return short.padEnd(LABEL_WIDTH);
}

export function ExerciseList({ exercises, onSelect, onBack, onSearchActive }: Props) {
  const [highlighted, setHighlighted] = useState<Exercise>(exercises[0]);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    onSearchActive?.(searching);
    return () => onSearchActive?.(false);
  }, [searching, onSearchActive]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? exercises.filter(
        (e) => e.name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q),
      )
    : exercises;

  const exitSearch = () => {
    setSearching(false);
    setQuery('');
  };

  useInput(
    (input, key) => {
      if (searching) return;
      if (key.escape) onBack();
      if (input === '/') {
        setQuery('');
        setSearching(true);
      }
    },
  );

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
              if (filtered.length > 0) onSelect(filtered[0]);
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
                hint: `${e.difficulty} · ${e.time}`,
              }))}
              onSelect={onSelect}
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
                <Text dimColor>source: {validationLabel(highlighted)}</Text>
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