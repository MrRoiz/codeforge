import { Box, Text, useInput } from 'ink';
import { useEffect, useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
  isActive?: boolean;
  placeholder?: string;
  /** caps both what is rendered and what can be entered */
  maxLength?: number;
}

export function TextInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  isActive = true,
  placeholder,
  maxLength,
}: Props) {
  // A parent can hand us a longer value (e.g. a hand-edited note in state.json);
  // never render more than the cap, or one frame floods the terminal.
  const limit = maxLength ?? Number.POSITIVE_INFINITY;
  const shown = value.length > limit ? value.slice(0, limit) : value;
  const [cursor, setCursor] = useState(shown.length);

  useEffect(() => {
    setCursor((c) => Math.min(c, shown.length));
  }, [shown.length]);

  useInput(
    (input, key) => {
      if (key.return) {
        onSubmit(shown);
        return;
      }
      if (key.escape) {
        onCancel?.();
        return;
      }
      if (key.leftArrow) {
        setCursor((c) => Math.max(0, c - 1));
        return;
      }
      if (key.rightArrow) {
        setCursor((c) => Math.min(shown.length, c + 1));
        return;
      }
      if (key.backspace || key.delete) {
        if (cursor === 0) {
          return;
        }
        onChange(shown.slice(0, cursor - 1) + shown.slice(cursor));
        setCursor((c) => Math.max(0, c - 1));
        return;
      }
      if (key.ctrl && input === 'u') {
        onChange('');
        setCursor(0);
        return;
      }
      if (key.ctrl && input === 'a') {
        setCursor(0);
        return;
      }
      if (key.ctrl && input === 'e') {
        setCursor(shown.length);
        return;
      }
      if (input && !key.ctrl && !key.meta && !key.tab) {
        // block new characters once the cap is reached; a paste that would
        // overflow only fills the remaining room
        const room = limit - shown.length;
        if (room <= 0) {
          return;
        }
        const inserted = input.length > room ? input.slice(0, room) : input;
        onChange(shown.slice(0, cursor) + inserted + shown.slice(cursor));
        setCursor(cursor + inserted.length);
      }
    },
    { isActive },
  );

  const before = shown.slice(0, cursor);
  const after = shown.slice(cursor);

  return (
    <Box>
      <Text>{before}</Text>
      <Text inverse>{after.length > 0 ? after[0] : ' '}</Text>
      <Text>{after.slice(1)}</Text>
      {shown.length === 0 && placeholder ? <Text dimColor> {placeholder}</Text> : null}
    </Box>
  );
}
