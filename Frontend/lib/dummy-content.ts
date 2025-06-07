export const dummyMarkdown = `
# Arrays and Strings

## Overview

Arrays and strings are fundamental data structures you'll encounter frequently in coding interviews. Understanding how to manipulate these effectively is crucial for success.

## Key Concepts

- Array traversal and manipulation
- Two-pointer techniques
- Sliding window patterns
- String manipulation algorithms

## Common Patterns

### Two Pointer Technique
The two-pointer technique is commonly used to solve array problems efficiently. Here's an example:

\`\`\`javascript
function twoSum(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) return [left, right];
        if (sum < target) left++;
        else right--;
    }
    return [];
}
\`\`\`

### Sliding Window
Sliding window is another powerful technique:

1. Initialize window pointers
2. Expand/contract window based on constraints
3. Update result as needed

## Practice Problems

1. Valid Anagram
2. Longest Substring Without Repeating Characters
3. Container With Most Water

> **Pro Tip**: Always clarify the constraints and requirements before jumping into the solution.

## Time Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Access    | O(1)          | -               |
| Search    | O(n)          | O(1)            |
| Insert    | O(n)          | O(1)            |
| Delete    | O(n)          | O(1)            |
`;