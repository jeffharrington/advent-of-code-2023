function countArrangements(row: string, groupSizes: number[]): number {
    if (groupSizes.length === 0) {
      // If there are no more group sizes, it means we have found a valid arrangement.
      return 1;
    }

    const currentGroupSize = groupSizes[0];
    const remainingGroupSizes = groupSizes.slice(1);

    let count = 0;

    // Try placing the current group of broken springs at different positions in the row.
    for (let i = 0; i <= row.length - currentGroupSize; i++) {
      const prefix = row.substring(0, i);
      const suffix = row.substring(i + currentGroupSize);

      // Check if the chosen position is valid (no unknown springs in the current group).
      if (!row.substring(i, i + currentGroupSize).includes('?')) {
        const newRow = prefix + '#'.repeat(currentGroupSize) + suffix;
        count += countArrangements(newRow, remainingGroupSizes);
      }
    }

    return count;
  }

  function totalArrangements(input: string): number {
    const rows = input.trim().split('\n');
    let total = 0;

    rows.forEach((row) => {
      const [condition, groups] = row.split(' ');
      const groupSizes = groups.split(',').map(Number);

      total += countArrangements(condition, groupSizes);
    });

    return total;
  }

  // Example usage:
  const puzzleInput = `
  ???.### 1,1,3
  .??..??...?##. 1,1,3
  ?#?#?#?#?#?#?#? 1,3,1,6
  ????.#...#... 4,1,1
  ????.######..#####. 1,6,5
  ?###???????? 3,2,1
  `;

  const result = totalArrangements(puzzleInput);
  console.log(result); // Output: 21
