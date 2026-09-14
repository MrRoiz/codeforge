import { Text, Box } from 'ink';

export const LOGO_LINES = [
  ' ██████╗ ██████╗ ██████╗ ███████╗███████╗ ██████╗ ██████╗  ██████╗ ███████╗',
  '██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝',
  '██║     ██║   ██║██║  ██║█████╗  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  ',
  '██║     ██║   ██║██║  ██║██╔══╝  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  ',
  '╚██████╗╚██████╔╝██████╔╝███████╗██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗',
  ' ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝',
];

export function Logo() {
  return (
    <Box flexDirection="column" alignItems="center">
      {LOGO_LINES.map((line, i) => (
        <Text key={i} color={i < 2 ? 'cyanBright' : i < 4 ? 'cyan' : 'blueBright'}>
          {line}
        </Text>
      ))}
      <Text color="yellowBright">
        {'⚒  FORGE YOUR SKILLS · ONE EXERCISE AT A TIME  ⚒'}
      </Text>
    </Box>
  );
}