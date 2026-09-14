import { Box, Text, useInput, measureElement, type DOMElement } from 'ink';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isActive?: boolean;
}

/**
 * Vertically scrollable region. The content keeps its natural height and is
 * clipped to the available space; scrolling moves it behind the viewport.
 * Up/Down, j/k, PageUp/PageDown, Home/End (g/G) and space/b are handled, and a
 * scrollbar is shown when there is more content than fits.
 */
export function ScrollView({ children, isActive = true }: Props) {
  const viewportRef = useRef<DOMElement>(null);
  const contentRef = useRef<DOMElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [offset, setOffset] = useState(0);

  // Re-measure after every render; only update state when a size actually changed.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (viewport) {
      const h = measureElement(viewport).height;
      setViewportHeight((prev) => (prev === h ? prev : h));
    }
    if (content) {
      const h = measureElement(content).height;
      setContentHeight((prev) => (prev === h ? prev : h));
    }
  });

  const maxOffset = Math.max(0, contentHeight - viewportHeight);
  const clamped = Math.min(offset, maxOffset);

  // keep the stored offset in range after the content shrinks or the terminal grows
  useEffect(() => {
    if (offset > maxOffset) setOffset(maxOffset);
  }, [offset, maxOffset]);

  const scrollTo = (next: number) => setOffset(Math.max(0, Math.min(maxOffset, next)));

  useInput(
    (input, key) => {
      if (maxOffset === 0) return;
      if (key.upArrow || input === 'k') scrollTo(clamped - 1);
      else if (key.downArrow || input === 'j') scrollTo(clamped + 1);
      else if (key.pageUp || input === 'b') scrollTo(clamped - viewportHeight);
      else if (key.pageDown || input === ' ') scrollTo(clamped + viewportHeight);
      else if (key.home || input === 'g') scrollTo(0);
      else if (key.end || input === 'G') scrollTo(maxOffset);
    },
    { isActive },
  );

  const scrollable = maxOffset > 0 && viewportHeight > 0;
  const thumbSize = scrollable
    ? Math.max(1, Math.round((viewportHeight / contentHeight) * viewportHeight))
    : 0;
  const thumbStart = scrollable
    ? Math.round(((viewportHeight - thumbSize) * clamped) / maxOffset)
    : 0;

  return (
    <Box flexDirection="row" flexGrow={1} flexShrink={1} minHeight={0} overflowX="hidden">
      <Box
        ref={viewportRef}
        flexDirection="column"
        flexGrow={1}
        flexShrink={1}
        minHeight={0}
        overflowY="hidden"
      >
        <Box ref={contentRef} flexDirection="column" flexShrink={0} marginTop={-clamped}>
          {children}
        </Box>
      </Box>
      <Box flexDirection="column" flexShrink={0} marginLeft={1} width={1} height={viewportHeight}>
        {scrollable
          ? Array.from({ length: viewportHeight }, (_, i) => {
              const thumb = i >= thumbStart && i < thumbStart + thumbSize;
              return (
                <Text key={i} color={thumb ? 'cyanBright' : undefined} dimColor={!thumb}>
                  {thumb ? '█' : '│'}
                </Text>
              );
            })
          : null}
      </Box>
    </Box>
  );
}
