import { checkForUpdates, type UpdateInfo } from '@utils/updates';
import { Box, Text } from 'ink';
import { useEffect, useState } from 'react';
import pkg from '../../package.json' with { type: 'json' };

export const LOGO_LINES = [
  ' ██████╗ ██████╗ ██████╗ ███████╗███████╗ ██████╗ ██████╗  ██████╗ ███████╗',
  '██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝',
  '██║     ██║   ██║██║  ██║█████╗  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  ',
  '██║     ██║   ██║██║  ██║██╔══╝  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  ',
  '╚██████╗╚██████╔╝██████╔╝███████╗██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗',
  ' ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝',
];

function logoColor(index: number): string {
  if (index < 2) {
    return 'cyanBright';
  }
  if (index < 4) {
    return 'cyan';
  }
  return 'blueBright';
}

export function Logo() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  // fire-and-forget update check; never blocks or breaks startup
  useEffect(() => {
    let mounted = true;
    void checkForUpdates().then((info) => {
      if (mounted) {
        setUpdateInfo(info);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box flexDirection="column" alignItems="center" flexShrink={0}>
      {LOGO_LINES.map((line, i) => (
        <Text key={line} color={logoColor(i)}>
          {line}
        </Text>
      ))}
      <Text color="yellowBright">{'⚒  FORGE YOUR SKILLS · ONE EXERCISE AT A TIME  ⚒'}</Text>
      <Text color="cyan">
        v{pkg.version}
        {updateInfo ? <Text color="greenBright"> → v{updateInfo.latest} available</Text> : null}
      </Text>
      <Text dimColor>p: Open in GitHub</Text>
    </Box>
  );
}
