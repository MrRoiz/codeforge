import { Box, Text, useInput } from 'ink';
import { useEffect, useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
  isActive?: boolean;
  placeholder?: string;
}

export function TextInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  isActive = true,
  placeholder,
}: Props) {
  const [cursor, setCursor] = useState(value.length);

  useEffect(() => {
    setCursor((c) => Math.min(c, value.length));
  }, [value.length]);

  useInput(
    (input, key) => {
      if (key.return) {
        onSubmit(value);
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
        setCursor((c) => Math.min(value.length, c + 1));
        return;
      }
      if (key.backspace || key.delete) {
        if (cursor === 0) {
          return;
        }
        onChange(value.slice(0, cursor - 1) + value.slice(cursor));
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
        setCursor(value.length);
        return;
      }
      if (input && !key.ctrl && !key.meta && !key.tab) {
        onChange(value.slice(0, cursor) + input + value.slice(cursor));
        setCursor((c) => c + input.length);
      }
    },
    { isActive },
  );

  const before = value.slice(0, cursor);
  const after = value.slice(cursor);

  return (
    <Box>
      <Text>{before}</Text>
      <Text inverse>{after.length > 0 ? after[0] : ' '}</Text>
      <Text>{after.slice(1)}</Text>
      {value.length === 0 && placeholder ? <Text dimColor> {placeholder}</Text> : null}
    </Box>
  );
}
