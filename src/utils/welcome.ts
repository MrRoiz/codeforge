// Short lines shown on the home screen: a small grin before a practice
// session. Kept dependency-free.
const WELCOME = [
  'Welcome back. The bugs were getting comfortable without you.',
  'Your keyboard missed you. The compiler did not.',
  'Ready to turn coffee into passing tests?',
  'Somewhere, an interviewer is nervously pacing. Good.',
  'Time to make the whiteboard nervous.',
  'Fresh session, same noble delusion: this one will be quick.',
  'The tests are cold, the clock is warm, and you are here.',
  'Today is a great day to out-think a loop.',
  'Autocomplete is off. Ego is optional. Let us go.',
  'You versus a blank editor. The editor is scared.',
  'Another day, another chance to impress a machine.',
  'Warm up those neurons, they have a workout coming.',
  'The rubber duck has been briefed and is standing by.',
  'Your future self at the interview says thanks in advance.',
  'Plot twist: this time the edge cases blink first.',
  'Sharpen up, the clock has been practicing too.',
  'No pressure. Only tests, time, and a slightly smug parser.',
  'The best time to grind was yesterday. The second best is now.',
  'One does not simply pass without practicing. Fortunately, you are here.',
  'Caffeine detected. Standards rising accordingly.',
  'Let us convert panic into a passing suite.',
  'You brought logic to a guessing fight. Nice.',
  'The bugs have no idea what is about to hit them.',
  'Every expert was once confused right here.',
  'Ship something green and call it character growth.',
  'Brave of you to practice instead of just telling people you code.',
  'The algorithm is only scary until you write it down.',
  'Tiny keyboard, big ambitions. Let us begin.',
  'You cannot spell "focused" without "focused". Wait, you can. Never mind.',
  'Somewhere a semicolon is about to ruin a good day. Stay vigilant.',
];

let lastIndex = -1;

/** Pick a line, avoiding an immediate repeat. */
export function pickWelcome(): string {
  if (WELCOME.length <= 1) {
    return WELCOME[0] ?? '';
  }
  let index = Math.floor(Math.random() * WELCOME.length);
  if (index === lastIndex) {
    index = (index + 1) % WELCOME.length;
  }
  lastIndex = index;
  return WELCOME[index];
}
