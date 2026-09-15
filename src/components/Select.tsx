import { Box, Text, useInput } from 'ink';
import { useEffect, useRef, useState } from 'react';

export interface SelectItem<T> {
  /** stable identity for React list keys */
  key: string;
  label: string;
  value: T;
  hint?: string;
  disabled?: boolean;
}

function findEnabledIndex<T>(items: SelectItem<T>[], from: number, delta: number): number {
  let index = from;
  let remaining = items.length;
  while (remaining > 0) {
    index = (index + delta + items.length) % items.length;
    if (!items[index].disabled) {
      break;
    }
    remaining--;
  }
  return index;
}

interface SelectProps<T> {
  items: SelectItem<T>[];
  onSelect: (value: T) => void;
  onHighlight?: (value: T, index: number) => void;
  isActive?: boolean;
  initialIndex?: number;
  marker?: string;
  color?: string;
}

export function Select<T>({
  items,
  onSelect,
  onHighlight,
  isActive = true,
  initialIndex = 0,
  marker = '❯',
  color = 'cyanBright',
}: SelectProps<T>) {
  const [index, setIndex] = useState(initialIndex);
  const lastInput = useRef<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only re-notify when the selection moves
  useEffect(() => {
    const item = items[index];
    if (item && onHighlight) {
      onHighlight(item.value, index);
    }
  }, [index, items]);

  useInput(
    (input, key) => {
      const prev = lastInput.current;
      lastInput.current = input;

      if (items.length === 0) {
        return;
      }

      if (key.upArrow || input === 'k') {
        setIndex((i) => findEnabledIndex(items, i, -1));
      } else if (key.downArrow || input === 'j') {
        setIndex((i) => findEnabledIndex(items, i, 1));
      } else if (input === 'G') {
        for (let i = items.length - 1; i >= 0; i--) {
          if (!items[i].disabled) {
            setIndex(i);
            break;
          }
        }
      } else if (input === 'g' && prev === 'g') {
        for (let i = 0; i < items.length; i++) {
          if (!items[i].disabled) {
            setIndex(i);
            break;
          }
        }
        lastInput.current = null;
      } else if (key.return) {
        const item = items[index];
        if (item && !item.disabled) {
          onSelect(item.value);
        }
      }
    },
    { isActive },
  );

  return (
    <Box flexDirection="column">
      {items.map((item, i) => {
        const active = i === index;
        const dim = item.disabled;
        return (
          <Box key={item.key}>
            <Text color={active ? color : undefined} dimColor={dim}>
              {active ? `${marker} ` : '  '}
              {item.label}
            </Text>
            {item.hint ? <Text dimColor> {item.hint}</Text> : null}
          </Box>
        );
      })}
    </Box>
  );
}
