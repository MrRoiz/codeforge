import { Box, Text, useInput } from 'ink';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface SelectItem<T> {
  /** stable identity for React list keys */
  key: string;
  label: string;
  value: T;
  hint?: string;
  /** optional fixed-width marker rendered before the label, e.g. a solved tick */
  leading?: string;
  leadingColor?: string;
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
  /** cap the number of rendered rows; the window follows the selection */
  maxVisible?: number;
}

export function Select<T>({
  items,
  onSelect,
  onHighlight,
  isActive = true,
  initialIndex = 0,
  marker = '❯',
  color = 'cyanBright',
  maxVisible,
}: SelectProps<T>) {
  const [index, setIndex] = useState(initialIndex);
  const [offset, setOffset] = useState(0);
  const lastInput = useRef<string | null>(null);

  const windowed = maxVisible !== undefined && items.length > maxVisible;
  const maxOffset = windowed ? items.length - maxVisible : 0;

  // Slide the window only when the selection leaves it, keeping it sticky.
  useLayoutEffect(() => {
    if (!windowed) {
      setOffset(0);
      return;
    }
    setOffset((prev) => {
      let next = prev;
      if (index < prev) {
        next = index;
      } else if (index >= prev + maxVisible) {
        next = index - maxVisible + 1;
      }
      return Math.max(0, Math.min(maxOffset, next));
    });
  }, [index, maxOffset, maxVisible, windowed]);

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

  const start = windowed ? offset : 0;
  const visible = windowed ? items.slice(start, start + maxVisible) : items;
  const hiddenAbove = start;
  const hiddenBelow = items.length - (start + visible.length);

  return (
    <Box flexDirection="column">
      {hiddenAbove > 0 ? <Text dimColor>{`  ↑ ${hiddenAbove} more`}</Text> : null}
      {visible.map((item, i) => {
        const active = start + i === index;
        const dim = item.disabled;
        return (
          <Box key={item.key}>
            <Text color={active ? color : undefined} dimColor={dim}>
              {active ? `${marker} ` : '  '}
            </Text>
            {item.leading ? (
              <Text color={item.leadingColor} dimColor={dim}>
                {item.leading}
              </Text>
            ) : null}
            <Text color={active ? color : undefined} dimColor={dim}>
              {item.label}
            </Text>
            {item.hint ? <Text dimColor> {item.hint}</Text> : null}
          </Box>
        );
      })}
      {hiddenBelow > 0 ? <Text dimColor>{`  ↓ ${hiddenBelow} more`}</Text> : null}
    </Box>
  );
}
