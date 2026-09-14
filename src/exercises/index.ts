export type { Exercise, ExerciseTest, Validation, ValidationLevel } from '@exercises/types';
export { validationLabel } from '@exercises/types';

export { twoSum } from '@exercises/two-sum';
export { validParentheses } from '@exercises/valid-parentheses';
export { reverseString } from '@exercises/reverse-string';
export { findPivotIndex } from '@exercises/find-pivot-index';
export { bestTimeBuySellStock } from '@exercises/best-time-buy-sell-stock';
export { longestSubstringNoRepeat } from '@exercises/longest-substring-no-repeat';
export { maxConsecutiveOnes } from '@exercises/max-consecutive-ones';
export { longestCommonPrefix } from '@exercises/longest-common-prefix';
export { productExceptSelf } from '@exercises/product-except-self';
export { containerWithMostWater } from '@exercises/container-with-most-water';
export { arrangingCoins } from '@exercises/arranging-coins';
export { mergeIntervals } from '@exercises/merge-intervals';
export { numberOfIslands } from '@exercises/number-of-islands';
export { validPalindrome } from '@exercises/valid-palindrome';
export { digitSumWithoutConversion } from '@exercises/digit-sum-without-conversion';
export { longestPalindromicSubstring } from '@exercises/longest-palindromic-substring';
export { meetingRoomsII } from '@exercises/meeting-rooms-ii';
export { minimumWindowSubstring } from '@exercises/minimum-window-substring';
export { perfectSquares } from '@exercises/perfect-squares';
export { permutations } from '@exercises/permutations';
export { stringCompression } from '@exercises/string-compression';
export { topNFrequentIps } from '@exercises/top-n-frequent-ips';
export { mostUsedRoutePerCourier } from '@exercises/most-used-route-per-courier';
export { uniquePathsII } from '@exercises/unique-paths-ii';
export { wordBreak } from '@exercises/word-break';
export { dependencyGraphOrdering } from '@exercises/dependency-graph-ordering';
export { ticketItineraryReconstruction } from '@exercises/ticket-itinerary-reconstruction';
export { lruCache } from '@exercises/lru-cache';
export { packageTransportation } from '@exercises/package-transportation';

import { twoSum } from '@exercises/two-sum';
import { validParentheses } from '@exercises/valid-parentheses';
import { reverseString } from '@exercises/reverse-string';
import { findPivotIndex } from '@exercises/find-pivot-index';
import { bestTimeBuySellStock } from '@exercises/best-time-buy-sell-stock';
import { longestSubstringNoRepeat } from '@exercises/longest-substring-no-repeat';
import { maxConsecutiveOnes } from '@exercises/max-consecutive-ones';
import { longestCommonPrefix } from '@exercises/longest-common-prefix';
import { productExceptSelf } from '@exercises/product-except-self';
import { containerWithMostWater } from '@exercises/container-with-most-water';
import { arrangingCoins } from '@exercises/arranging-coins';
import { mergeIntervals } from '@exercises/merge-intervals';
import { numberOfIslands } from '@exercises/number-of-islands';
import { validPalindrome } from '@exercises/valid-palindrome';
import { digitSumWithoutConversion } from '@exercises/digit-sum-without-conversion';
import { longestPalindromicSubstring } from '@exercises/longest-palindromic-substring';
import { meetingRoomsII } from '@exercises/meeting-rooms-ii';
import { minimumWindowSubstring } from '@exercises/minimum-window-substring';
import { perfectSquares } from '@exercises/perfect-squares';
import { permutations } from '@exercises/permutations';
import { stringCompression } from '@exercises/string-compression';
import { topNFrequentIps } from '@exercises/top-n-frequent-ips';
import { mostUsedRoutePerCourier } from '@exercises/most-used-route-per-courier';
import { uniquePathsII } from '@exercises/unique-paths-ii';
import { wordBreak } from '@exercises/word-break';
import { dependencyGraphOrdering } from '@exercises/dependency-graph-ordering';
import { ticketItineraryReconstruction } from '@exercises/ticket-itinerary-reconstruction';
import { lruCache } from '@exercises/lru-cache';
import { packageTransportation } from '@exercises/package-transportation';
import type { Exercise } from '@exercises/types';

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
