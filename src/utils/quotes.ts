// Short lines shown when a run passes: the point is a small motivational lift
// with a wink. Kept dependency-free.
const QUOTES = [
  'You solved it under pressure. That is the whole skill.',
  'Green tests. The clock never really stood a chance.',
  'First try. Allow yourself one dignified fist pump.',
  'Edge cases handled. Somewhere, an interviewer smiled.',
  'You reasoned it out with no autocomplete to thank.',
  'Clean run. Same energy next round.',
  'You stayed calm and shipped. That is the job.',
  'Another one down. The whiteboard can relax.',
  'Momentum is quietly on your side.',
  'You made it look easy. It was not.',
  'Passing tests and a slightly smug grin. Earned.',
  'The hard part was starting, and you did far more than that.',
  'You turned a blank page into a passing suite.',
  'Calm hands, sharp mind, green bar.',
  'This is what prepared feels like. Get used to it.',
  'You out-thought the clock, which is now sulking.',
  'One more rep banked. Interview day is getting nervous.',
  'You wrote it like you had done it before. Maybe now you have.',
  'Solid work. The rubber duck can retire happy.',
  'You found the pattern. That is the whole trick.',
  'Deadline met. Dignity intact.',
  'Confidence is just evidence. Here is some more.',
  'You thought in edge cases. That is senior energy.',
  'Nice. Do that again when it counts.',
  'The suite approves. It rarely approves.',
  'You earned this green. Sit with it a second.',
  'Under the lights, you delivered.',
  'Small rep, real progress.',
  'You made the tests agree. Diplomacy.',
  'Clean, correct, calm. Pick any two to brag about.',
  'You just made a hard thing look routine.',
  'The bug never saw you coming.',
  'Progress banked, and it compounds.',
  'You kept your head. The timer lost its.',
  'That was skill. Luck was just watching.',
  'One more unknown, retired.',
  'You shipped code a machine signed off on. Nice.',
  'Sharp work. Go be slightly insufferable about it.',
  'You did the thing. The thing is now afraid of you.',
  'Practice like this is why you will be ready.',
];

let lastIndex = -1;

/** Pick a line, avoiding an immediate repeat. */
export function pickQuote(): string {
  if (QUOTES.length <= 1) return QUOTES[0] ?? '';
  let index = Math.floor(Math.random() * QUOTES.length);
  if (index === lastIndex) index = (index + 1) % QUOTES.length;
  lastIndex = index;
  return QUOTES[index];
}
