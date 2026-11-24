/** Build a picker that returns a random line, never the same one twice in a row. */
export function createLinePicker(lines: readonly string[]): () => string {
  let lastIndex = -1;

  return () => {
    let index = Math.floor(Math.random() * lines.length);
    if (index === lastIndex) {
      index = (index + 1) % lines.length;
    }
    lastIndex = index;
    return lines[index];
  };
}
