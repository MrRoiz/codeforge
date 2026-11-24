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

const SELECTED_MARKER = '❯';
const SELECTED_COLOR = 'cyanBright';

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
  onHighlight?: (value: T) => void;
  isActive?: boolean;
  /** cap the number of rendered rows; the window follows the selection */
  maxVisible?: number;
}

export function Select<T>({
  items,
  onSelect,
  onHighlight,
  isActive = true,
  maxVisible,
}: SelectProps<T>) {
  const [index, setIndex] = useState(0);
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
      onHighlight(item.value);
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
        // stepping back from the first item wraps to the last enabled one
        setIndex(findEnabledIndex(items, 0, -1));
      } else if (input === 'g' && prev === 'g') {
        // stepping forward from the last item wraps to the first enabled one
        setIndex(findEnabledIndex(items, items.length - 1, 1));
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
            <Text color={active ? SELECTED_COLOR : undefined} dimColor={dim}>
              {active ? `${SELECTED_MARKER} ` : '  '}
            </Text>
            {item.leading ? (
              <Text color={item.leadingColor} dimColor={dim}>
                {item.leading}
              </Text>
            ) : null}
            <Text color={active ? SELECTED_COLOR : undefined} dimColor={dim}>
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
