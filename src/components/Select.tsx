import { Box, Text, useInput } from 'ink';
import { useEffect, useState } from 'react';

export interface SelectItem<T> {
  label: string;
  value: T;
  key?: string;
  hint?: string;
  disabled?: boolean;
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

  useEffect(() => {
    const item = items[index];
    if (item && onHighlight) onHighlight(item.value, index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items]);

  useInput(
    (_input, key) => {
      if (key.upArrow) {
        setIndex((i) => {
          let next = i;
          for (let step = 0; step < items.length; step++) {
            next = (next - 1 + items.length) % items.length;
            if (!items[next].disabled) break;
          }
          return next;
        });
      } else if (key.downArrow) {
        setIndex((i) => {
          let next = i;
          for (let step = 0; step < items.length; step++) {
            next = (next + 1) % items.length;
            if (!items[next].disabled) break;
          }
          return next;
        });
      } else if (key.return) {
        const item = items[index];
        if (item && !item.disabled) onSelect(item.value);
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
          <Box key={item.key ?? `${i}:${item.label}`}>
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