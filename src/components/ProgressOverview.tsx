import { progressSummaryAtom } from '@app/store';
import { difficultyColor } from '@components/ui';
import { Box, Text } from 'ink';
import { useAtomValue } from 'jotai';

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
const BAR_WIDTH = 20;

function progressBar(solved: number, total: number): string {
  const filled = total === 0 ? 0 : Math.round((solved / total) * BAR_WIDTH);
  return '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
}

interface RowProps {
  label: string;
  labelColor?: string;
  value: string;
  valueColor?: string;
  valueBold?: boolean;
}

/** A label on the left and its value on the right, filling the card width. */
function Row({ label, labelColor, value, valueColor, valueBold = false }: RowProps) {
  return (
    <Box width="100%" justifyContent="space-between">
      <Text color={labelColor} dimColor={labelColor === undefined}>
        {label}
      </Text>
      <Text color={valueColor} bold={valueBold}>
        {value}
      </Text>
    </Box>
  );
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

      <Box marginTop={1} flexDirection="column" width={BAR_WIDTH}>
        <Text color={complete ? 'greenBright' : 'cyanBright'}>{progressBar(solved, total)}</Text>

        <Row label="attempts" value={String(attempts)} valueColor="magentaBright" />

        <Row
          label="solved"
          value={`${solved}/${total}`}
          valueColor={complete ? 'greenBright' : 'whiteBright'}
          valueBold
        />

        {DIFFICULTIES.map((difficulty) => (
          <Row
            key={difficulty}
            label={difficulty}
            labelColor={difficultyColor(difficulty)}
            value={`${byDifficulty[difficulty].solved}/${byDifficulty[difficulty].total}`}
          />
        ))}
      </Box>
    </Box>
  );
}
