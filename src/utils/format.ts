/**
 * Pretty-print JSON-like literals embedded in free-form example strings.
 *
 * Exercise examples are authored as prose with inline data, e.g.
 *   "grid = [[0,0,0],[0,1,0],[0,0,0]]"
 *   'nums = [2, 7, 11, 15], target = 9'
 *   'deliveries = [{courier:"A",origin:"NY",destination:"LA"}]'
 *
 * `formatExample` finds balanced array/object literals, parses them even when
 * they use JS-literal syntax (unquoted keys, single quotes), and re-emits them
 * compactly: scalar-only arrays/objects stay inline (`[1, 3]`) while nested
 * structures break across lines. The result is idempotent.
 */

/** Index just past the string literal starting at `start`, or the end of input. */
function skipString(input: string, start: number): number {
  const quote = input[start];
  let i = start + 1;
  while (i < input.length) {
    const ch = input[i];
    if (ch === '\\') {
      i += 2;
      continue;
    }
    if (ch === quote) return i + 1;
    i++;
  }
  return i;
}

/** Index of the bracket matching the one at `start`, or -1 if unbalanced. */
function matchBracket(input: string, start: number): number {
  const stack: string[] = [input[start] === '[' ? ']' : '}'];
  let i = start + 1;
  while (i < input.length) {
    const ch = input[i];
    if (ch === '"' || ch === "'") {
      i = skipString(input, i);
      continue;
    }
    if (ch === '[') stack.push(']');
    else if (ch === '{') stack.push('}');
    else if (ch === ']' || ch === '}') {
      if (stack[stack.length - 1] !== ch) return -1;
      stack.pop();
      if (stack.length === 0) return i;
    }
    i++;
  }
  return -1;
}

/** Recursive-descent parser for JSON with optional unquoted keys and single quotes. */
class LooseParser {
  private i = 0;

  constructor(private readonly input: string) {}

  parse(): unknown {
    const value = this.value();
    this.skipWhitespace();
    if (this.i !== this.input.length) throw new Error('trailing input');
    return value;
  }

  private skipWhitespace(): void {
    while (this.i < this.input.length && /\s/.test(this.input[this.i])) this.i++;
  }

  private value(): unknown {
    this.skipWhitespace();
    const ch = this.input[this.i];
    if (ch === '{') return this.object();
    if (ch === '[') return this.array();
    if (ch === '"' || ch === "'") return this.string();
    if (ch === '-' || (ch >= '0' && ch <= '9')) return this.number();
    return this.identifierValue();
  }

  private object(): Record<string, unknown> {
    this.i++;
    const result: Record<string, unknown> = {};
    this.skipWhitespace();
    if (this.input[this.i] === '}') {
      this.i++;
      return result;
    }
    for (;;) {
      this.skipWhitespace();
      const ch = this.input[this.i];
      const key = ch === '"' || ch === "'" ? this.string() : this.identifierName();
      this.skipWhitespace();
      if (this.input[this.i] !== ':') throw new Error('expected ":"');
      this.i++;
      result[key] = this.value();
      this.skipWhitespace();
      const next = this.input[this.i];
      if (next === ',') {
        this.i++;
        continue;
      }
      if (next === '}') {
        this.i++;
        return result;
      }
      throw new Error('expected "," or "}"');
    }
  }

  private array(): unknown[] {
    this.i++;
    const result: unknown[] = [];
    this.skipWhitespace();
    if (this.input[this.i] === ']') {
      this.i++;
      return result;
    }
    for (;;) {
      result.push(this.value());
      this.skipWhitespace();
      const next = this.input[this.i];
      if (next === ',') {
        this.i++;
        continue;
      }
      if (next === ']') {
        this.i++;
        return result;
      }
      throw new Error('expected "," or "]"');
    }
  }

  private string(): string {
    const quote = this.input[this.i++];
    let out = '';
    while (this.i < this.input.length) {
      const ch = this.input[this.i++];
      if (ch === quote) return out;
      if (ch !== '\\') {
        out += ch;
        continue;
      }
      const esc = this.input[this.i++];
      if (esc === 'n') out += '\n';
      else if (esc === 't') out += '\t';
      else if (esc === 'r') out += '\r';
      else if (esc === 'b') out += '\b';
      else if (esc === 'f') out += '\f';
      else if (esc === 'u') {
        out += String.fromCharCode(Number.parseInt(this.input.slice(this.i, this.i + 4), 16));
        this.i += 4;
      } else out += esc;
    }
    throw new Error('unterminated string');
  }

  private number(): number {
    const start = this.i;
    if (this.input[this.i] === '-') this.i++;
    while (/[0-9]/.test(this.input[this.i] ?? '')) this.i++;
    if (this.input[this.i] === '.') {
      this.i++;
      while (/[0-9]/.test(this.input[this.i] ?? '')) this.i++;
    }
    if (this.input[this.i] === 'e' || this.input[this.i] === 'E') {
      this.i++;
      if (this.input[this.i] === '+' || this.input[this.i] === '-') this.i++;
      while (/[0-9]/.test(this.input[this.i] ?? '')) this.i++;
    }
    if (this.i === start) throw new Error('expected number');
    return Number(this.input.slice(start, this.i));
  }

  private identifierName(): string {
    const start = this.i;
    while (/[A-Za-z0-9_$]/.test(this.input[this.i] ?? '')) this.i++;
    if (this.i === start) throw new Error('expected identifier');
    return this.input.slice(start, this.i);
  }

  private identifierValue(): unknown {
    const name = this.identifierName();
    if (name === 'true') return true;
    if (name === 'false') return false;
    if (name === 'null' || name === 'undefined' || name === 'NaN') return null;
    throw new Error(`unexpected identifier "${name}"`);
  }
}

function isScalar(value: unknown): boolean {
  return value === null || typeof value !== 'object';
}

function scalarLiteral(value: unknown): string {
  return JSON.stringify(value) ?? 'null';
}

/**
 * Pretty-print a parsed value: arrays and objects whose members are all scalars
 * stay on one line (`[1, 3]`, `{ "a": 1 }`), while anything containing nested
 * arrays/objects breaks across lines. Scalar values use JSON.stringify.
 */
function stringifyValue(value: unknown, indent: number): string {
  const pad = '  '.repeat(indent);
  const childPad = '  '.repeat(indent + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.every(isScalar)) return `[${value.map(scalarLiteral).join(', ')}]`;
    const items = value.map((item) => `${childPad}${stringifyValue(item, indent + 1)}`);
    return `[\n${items.join(',\n')}\n${pad}]`;
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    if (entries.every(([, val]) => isScalar(val))) {
      return `{ ${entries.map(([key, val]) => `${JSON.stringify(key)}: ${scalarLiteral(val)}`).join(', ')} }`;
    }
    const items = entries.map(
      ([key, val]) => `${childPad}${JSON.stringify(key)}: ${stringifyValue(val, indent + 1)}`,
    );
    return `{\n${items.join(',\n')}\n${pad}}`;
  }

  return scalarLiteral(value);
}

/** Format a single literal, or return null if it does not need reformatting. */
function tryFormat(segment: string): string | null {
  let parsed: unknown;
  try {
    parsed = new LooseParser(segment).parse();
  } catch {
    return null;
  }
  const formatted = stringifyValue(parsed, 0);
  return formatted.includes('\n') ? formatted : null;
}

/** Pretty-print JSON-like literals embedded in an example value. */
export function formatExample(value: string): string {
  let out = '';
  let i = 0;
  while (i < value.length) {
    const ch = value[i];
    if (ch === '"' || ch === "'") {
      const end = skipString(value, i);
      out += value.slice(i, end);
      i = end;
      continue;
    }
    if (ch === '[' || ch === '{') {
      const end = matchBracket(value, i);
      if (end !== -1) {
        const segment = value.slice(i, end + 1);
        out += tryFormat(segment) ?? segment;
        i = end + 1;
        continue;
      }
    }
    out += ch;
    i++;
  }
  return out;
}
