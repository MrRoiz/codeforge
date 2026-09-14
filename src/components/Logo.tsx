import { Text, Box } from 'ink';
import { useEffect, useState } from 'react';
import pkg from '../../package.json' with { type: 'json' };
import { checkForUpdates, type UpdateInfo } from '@utils/updates';

export const LOGO_LINES = [
  ' ██████╗ ██████╗ ██████╗ ███████╗███████╗ ██████╗ ██████╗  ██████╗ ███████╗',
  '██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝',
  '██║     ██║   ██║██║  ██║█████╗  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  ',
  '██║     ██║   ██║██║  ██║██╔══╝  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  ',
  '╚██████╗╚██████╔╝██████╔╝███████╗██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗',
  ' ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝',
];

export function Logo() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  // fire-and-forget update check; never blocks or breaks startup
  useEffect(() => {
    let mounted = true;
    void checkForUpdates().then((info) => {
      if (mounted) setUpdateInfo(info);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box flexDirection="column" alignItems="center" flexShrink={0}>
      {LOGO_LINES.map((line, i) => (
        <Text key={i} color={i < 2 ? 'cyanBright' : i < 4 ? 'cyan' : 'blueBright'}>
          {line}
        </Text>
      ))}
      <Text color="yellowBright">
        {'⚒  FORGE YOUR SKILLS · ONE EXERCISE AT A TIME  ⚒'}
      </Text>
      <Text color="cyan">
        v{pkg.version}
        {updateInfo ? <Text color="greenBright">  → v{updateInfo.latest} available</Text> : null}
      </Text>
      <Text dimColor>o: Open in Github</Text>
    </Box>
  );
}