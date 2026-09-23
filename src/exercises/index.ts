export { arrangingCoins } from '@exercises/arranging-coins';
export { bestTimeBuySellStock } from '@exercises/best-time-buy-sell-stock';
export { binarySearch } from '@exercises/binary-search';
export { chainableCalculator } from '@exercises/chainable-calculator';
export { climbingStairs } from '@exercises/climbing-stairs';
export { coinChange } from '@exercises/coin-change';
export { containerWithMostWater } from '@exercises/container-with-most-water';
export { dependencyGraphOrdering } from '@exercises/dependency-graph-ordering';
export { digitSumWithoutConversion } from '@exercises/digit-sum-without-conversion';
export { fibonacciNumber } from '@exercises/fibonacci-number';
export { findPivotIndex } from '@exercises/find-pivot-index';
export { fizzBuzz } from '@exercises/fizzbuzz';
export { groupAnagrams } from '@exercises/group-anagrams';
export { findKthLargest } from '@exercises/kth-largest-element';
export { largestRectangleArea } from '@exercises/largest-rectangle-in-histogram';
export { longestCommonPrefix } from '@exercises/longest-common-prefix';
export { longestConsecutive } from '@exercises/longest-consecutive-sequence';
export { lengthOfLIS } from '@exercises/longest-increasing-subsequence';
export { longestPalindromicSubstring } from '@exercises/longest-palindromic-substring';
export { longestSubstringNoRepeat } from '@exercises/longest-substring-no-repeat';
export { lruCache } from '@exercises/lru-cache';
export { maxConsecutiveOnes } from '@exercises/max-consecutive-ones';
export { maxDepthBinaryTree } from '@exercises/max-depth-binary-tree';
export { meetingRoomsII } from '@exercises/meeting-rooms-ii';
export { mergeIntervals } from '@exercises/merge-intervals';
export { mergeTwoSortedLists } from '@exercises/merge-two-sorted-lists';
export { minStack } from '@exercises/min-stack';
export { minimumWindowSubstring } from '@exercises/minimum-window-substring';
export { missingNumber } from '@exercises/missing-number';
export { mostUsedRoutePerCourier } from '@exercises/most-used-route-per-courier';
export { moveZeroes } from '@exercises/move-zeroes';
export { numberOfIslands } from '@exercises/number-of-islands';
export { packageTransportation } from '@exercises/package-transportation';
export { palindromeNumber } from '@exercises/palindrome-number';
export { perfectSquares } from '@exercises/perfect-squares';
export { permutations } from '@exercises/permutations';
export { productExceptSelf } from '@exercises/product-except-self';
export { representativeLeadAssignment } from '@exercises/representative-lead-assignment';
export { reverseString } from '@exercises/reverse-string';
export { singleNumber } from '@exercises/single-number';
export { sqrtX } from '@exercises/sqrt-x';
export { stepsToMakeArrayNonDecreasing } from '@exercises/steps-to-make-array-non-decreasing';
export { stringCompression } from '@exercises/string-compression';
export { ticketItineraryReconstruction } from '@exercises/ticket-itinerary-reconstruction';
export { topNFrequentIps } from '@exercises/top-n-frequent-ips';
export { twoSum } from '@exercises/two-sum';
export type { Exercise, ExerciseTest, TestConfig } from '@exercises/types';
export { uniquePathsII } from '@exercises/unique-paths-ii';
export { validAnagram } from '@exercises/valid-anagram';
export { validPalindrome } from '@exercises/valid-palindrome';
export { validParentheses } from '@exercises/valid-parentheses';
export { validateBst } from '@exercises/validate-bst';
export { wordBreak } from '@exercises/word-break';

import { arrangingCoins } from '@exercises/arranging-coins';
import { bestTimeBuySellStock } from '@exercises/best-time-buy-sell-stock';
import { binarySearch } from '@exercises/binary-search';
import { chainableCalculator } from '@exercises/chainable-calculator';
import { climbingStairs } from '@exercises/climbing-stairs';
import { coinChange } from '@exercises/coin-change';
import { containerWithMostWater } from '@exercises/container-with-most-water';
import { dependencyGraphOrdering } from '@exercises/dependency-graph-ordering';
import { digitSumWithoutConversion } from '@exercises/digit-sum-without-conversion';
import { fibonacciNumber } from '@exercises/fibonacci-number';
import { findPivotIndex } from '@exercises/find-pivot-index';
import { fizzBuzz } from '@exercises/fizzbuzz';
import { groupAnagrams } from '@exercises/group-anagrams';
import { findKthLargest } from '@exercises/kth-largest-element';
import { largestRectangleArea } from '@exercises/largest-rectangle-in-histogram';
import { longestCommonPrefix } from '@exercises/longest-common-prefix';
import { longestConsecutive } from '@exercises/longest-consecutive-sequence';
import { lengthOfLIS } from '@exercises/longest-increasing-subsequence';
import { longestPalindromicSubstring } from '@exercises/longest-palindromic-substring';
import { longestSubstringNoRepeat } from '@exercises/longest-substring-no-repeat';
import { lruCache } from '@exercises/lru-cache';
import { maxConsecutiveOnes } from '@exercises/max-consecutive-ones';
import { maxDepthBinaryTree } from '@exercises/max-depth-binary-tree';
import { meetingRoomsII } from '@exercises/meeting-rooms-ii';
import { mergeIntervals } from '@exercises/merge-intervals';
import { mergeTwoSortedLists } from '@exercises/merge-two-sorted-lists';
import { minStack } from '@exercises/min-stack';
import { minimumWindowSubstring } from '@exercises/minimum-window-substring';
import { missingNumber } from '@exercises/missing-number';
import { mostUsedRoutePerCourier } from '@exercises/most-used-route-per-courier';
import { moveZeroes } from '@exercises/move-zeroes';
import { numberOfIslands } from '@exercises/number-of-islands';
import { packageTransportation } from '@exercises/package-transportation';
import { palindromeNumber } from '@exercises/palindrome-number';
import { perfectSquares } from '@exercises/perfect-squares';
import { permutations } from '@exercises/permutations';
import { productExceptSelf } from '@exercises/product-except-self';
import { representativeLeadAssignment } from '@exercises/representative-lead-assignment';
import { reverseString } from '@exercises/reverse-string';
import { singleNumber } from '@exercises/single-number';
import { sqrtX } from '@exercises/sqrt-x';
import { stepsToMakeArrayNonDecreasing } from '@exercises/steps-to-make-array-non-decreasing';
import { stringCompression } from '@exercises/string-compression';
import { ticketItineraryReconstruction } from '@exercises/ticket-itinerary-reconstruction';
import { topNFrequentIps } from '@exercises/top-n-frequent-ips';
import { twoSum } from '@exercises/two-sum';
import type { Exercise } from '@exercises/types';
import { uniquePathsII } from '@exercises/unique-paths-ii';
import { validAnagram } from '@exercises/valid-anagram';
import { validPalindrome } from '@exercises/valid-palindrome';
import { validParentheses } from '@exercises/valid-parentheses';
import { validateBst } from '@exercises/validate-bst';
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
  fizzBuzz,
  fibonacciNumber,
  climbingStairs,
  binarySearch,
  palindromeNumber,
  sqrtX,
  singleNumber,
  missingNumber,
  validAnagram,
  moveZeroes,
  mergeTwoSortedLists,
  maxDepthBinaryTree,
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
  representativeLeadAssignment,
  uniquePathsII,
  wordBreak,
  dependencyGraphOrdering,
  ticketItineraryReconstruction,
  lruCache,
  chainableCalculator,
  packageTransportation,
  stepsToMakeArrayNonDecreasing,
  groupAnagrams,
  longestConsecutive,
  minStack,
  validateBst,
  findKthLargest,
  coinChange,
  lengthOfLIS,
  // hard
  minimumWindowSubstring,
  largestRectangleArea,
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
