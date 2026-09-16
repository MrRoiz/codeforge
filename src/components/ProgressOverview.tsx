import { progressSummaryAtom } from '@app/store';
import { difficultyColor } from '@components/ui';
import { Box, Text } from 'ink';
import { useAtomValue } from 'jotai';

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
const BAR_WIDTH = 20;
const LABEL_WIDTH = 9;
const VALUE_WIDTH = 4;

function progressBar(solved: number, total: number): string {
  const filled = total === 0 ? 0 : Math.round((solved / total) * BAR_WIDTH);
  return '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
}

/** Home-screen card: how much of the catalog is solved and how much you grinded. */
export function ProgressOverview() {
  const { solved, total, attempts, byDifficulty } = useAtomValue(progressSummaryAtom);
  const complete = total > 0 && solved === total;

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={2} flexShrink={0}>
      <Text color="cyanBright" bold>
        PROGRESS
      </Text>

      <Box marginTop={1} flexDirection="column">
        <Text color={complete ? 'greenBright' : 'cyanBright'}>{progressBar(solved, total)}</Text>

        <Text>
          <Text dimColor>{'solved'.padEnd(LABEL_WIDTH)}</Text>
          <Text bold color={complete ? 'greenBright' : 'whiteBright'}>
            {`${solved}/${total}`.padStart(VALUE_WIDTH)}
          </Text>
        </Text>

        {DIFFICULTIES.map((difficulty) => (
          <Text key={difficulty}>
            <Text color={difficultyColor(difficulty)}>{difficulty.padEnd(LABEL_WIDTH)}</Text>
            <Text dimColor>
              {`${byDifficulty[difficulty].solved}/${byDifficulty[difficulty].total}`.padStart(
                VALUE_WIDTH,
              )}
            </Text>
          </Text>
        ))}

        <Text>
          <Text dimColor>{'attempts'.padEnd(LABEL_WIDTH)}</Text>
          <Text color="magentaBright">{String(attempts).padStart(VALUE_WIDTH)}</Text>
        </Text>
      </Box>
    </Box>
  );
}
