export { arrangingCoins } from '@exercises/arranging-coins';
export { bestTimeBuySellStock } from '@exercises/best-time-buy-sell-stock';
export { containerWithMostWater } from '@exercises/container-with-most-water';
export { dependencyGraphOrdering } from '@exercises/dependency-graph-ordering';
export { digitSumWithoutConversion } from '@exercises/digit-sum-without-conversion';
export { findPivotIndex } from '@exercises/find-pivot-index';
export { longestCommonPrefix } from '@exercises/longest-common-prefix';
export { longestPalindromicSubstring } from '@exercises/longest-palindromic-substring';
export { longestSubstringNoRepeat } from '@exercises/longest-substring-no-repeat';
export { lruCache } from '@exercises/lru-cache';
export { maxConsecutiveOnes } from '@exercises/max-consecutive-ones';
export { meetingRoomsII } from '@exercises/meeting-rooms-ii';
export { mergeIntervals } from '@exercises/merge-intervals';
export { minimumWindowSubstring } from '@exercises/minimum-window-substring';
export { mostUsedRoutePerCourier } from '@exercises/most-used-route-per-courier';
export { numberOfIslands } from '@exercises/number-of-islands';
export { packageTransportation } from '@exercises/package-transportation';
export { perfectSquares } from '@exercises/perfect-squares';
export { permutations } from '@exercises/permutations';
export { productExceptSelf } from '@exercises/product-except-self';
export { reverseString } from '@exercises/reverse-string';
export { stepsToMakeArrayNonDecreasing } from '@exercises/steps-to-make-array-non-decreasing';
export { stringCompression } from '@exercises/string-compression';
export { ticketItineraryReconstruction } from '@exercises/ticket-itinerary-reconstruction';
export { topNFrequentIps } from '@exercises/top-n-frequent-ips';
export { twoSum } from '@exercises/two-sum';
export type {
  Exercise,
  ExerciseTest,
  TestConfig,
  Validation,
  ValidationLevel,
} from '@exercises/types';
export { validationLabel } from '@exercises/types';
export { uniquePathsII } from '@exercises/unique-paths-ii';
export { validPalindrome } from '@exercises/valid-palindrome';
export { validParentheses } from '@exercises/valid-parentheses';
export { wordBreak } from '@exercises/word-break';

import { arrangingCoins } from '@exercises/arranging-coins';
import { bestTimeBuySellStock } from '@exercises/best-time-buy-sell-stock';
import { containerWithMostWater } from '@exercises/container-with-most-water';
import { dependencyGraphOrdering } from '@exercises/dependency-graph-ordering';
import { digitSumWithoutConversion } from '@exercises/digit-sum-without-conversion';
import { findPivotIndex } from '@exercises/find-pivot-index';
import { longestCommonPrefix } from '@exercises/longest-common-prefix';
import { longestPalindromicSubstring } from '@exercises/longest-palindromic-substring';
import { longestSubstringNoRepeat } from '@exercises/longest-substring-no-repeat';
import { lruCache } from '@exercises/lru-cache';
import { maxConsecutiveOnes } from '@exercises/max-consecutive-ones';
import { meetingRoomsII } from '@exercises/meeting-rooms-ii';
import { mergeIntervals } from '@exercises/merge-intervals';
import { minimumWindowSubstring } from '@exercises/minimum-window-substring';
import { mostUsedRoutePerCourier } from '@exercises/most-used-route-per-courier';
import { numberOfIslands } from '@exercises/number-of-islands';
import { packageTransportation } from '@exercises/package-transportation';
import { perfectSquares } from '@exercises/perfect-squares';
import { permutations } from '@exercises/permutations';
import { productExceptSelf } from '@exercises/product-except-self';
import { reverseString } from '@exercises/reverse-string';
import { stepsToMakeArrayNonDecreasing } from '@exercises/steps-to-make-array-non-decreasing';
import { stringCompression } from '@exercises/string-compression';
import { ticketItineraryReconstruction } from '@exercises/ticket-itinerary-reconstruction';
import { topNFrequentIps } from '@exercises/top-n-frequent-ips';
import { twoSum } from '@exercises/two-sum';
import type { Exercise } from '@exercises/types';
import { uniquePathsII } from '@exercises/unique-paths-ii';
import { validPalindrome } from '@exercises/valid-palindrome';
import { validParentheses } from '@exercises/valid-parentheses';
import { wordBreak } from '@exercises/word-break';

export const exercises: Exercise[] = [
  // easy
  twoSum,
  validParentheses,
  reverseString,
  findPivotIndex,
  bestTimeBuySellStock,
  maxConsecutiveOnes,
  longestCommonPrefix,
  arrangingCoins,
  validPalindrome,
  digitSumWithoutConversion,
  // medium
  longestSubstringNoRepeat,
  productExceptSelf,
  containerWithMostWater,
  mergeIntervals,
  numberOfIslands,
  longestPalindromicSubstring,
  meetingRoomsII,
  perfectSquares,
  permutations,
  stringCompression,
  topNFrequentIps,
  mostUsedRoutePerCourier,
  uniquePathsII,
  wordBreak,
  dependencyGraphOrdering,
  ticketItineraryReconstruction,
  lruCache,
  packageTransportation,
  stepsToMakeArrayNonDecreasing,
  // hard
  minimumWindowSubstring,
];

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getRandomExercise(difficulty?: Exercise['difficulty']): Exercise {
  const pool = difficulty ? exercises.filter((e) => e.difficulty === difficulty) : exercises;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getExercisesByDifficulty(difficulty: Exercise['difficulty']): Exercise[] {
  return exercises.filter((e) => e.difficulty === difficulty);
}
