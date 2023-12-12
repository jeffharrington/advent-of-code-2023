import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, parse } from "path";

/**
 * Day 12: Hot Springs
 * https://adventofcode.com/2023/day/12
 */
const process = (lines: string[]) => {
    let sum = 0;
    lines.forEach((line) => {
        const springs = line.split(" ")[0].split("");
        const conditions = line
            .split(" ")[1]
            .split(",")
            .map((c) => parseInt(c));
        const numPossibilities = getPossibilities(springs, 0, conditions, 0, 0, {});
        sum += numPossibilities;
    });
    return sum;
};

function getPossibilities(
    blocks: string[],
    i: number, // Block index
    conditions: number[],
    c: number, // Condition index
    runLength: number,
    table: Record<string, number>,
): number {
    const key = [i, c, runLength].join(",");

    if (Object.keys(table).includes(key)) {
        return table[key];
    }

    if (i == blocks.length) {
        if (c == conditions.length && runLength == 0) {
            // We've reached the end and fit all the conditions
            return 1;
        } else if (c == conditions.length - 1 && conditions[c] == runLength) {
            // We can fit the final condition perfectly
            return 1;
        } else {
            // We still have conditions left to fit
            return 0;
        }
    }

    let count = 0;
    [".", "#"].forEach((char) => {
        if (blocks[i] == char || blocks[i] == "?") {
            if (char == "." && runLength == 0) {
                // We're not currently within a run of springs, continue on...
                count += getPossibilities(
                    blocks,
                    i + 1, // Next block
                    conditions,
                    c, // Current condition
                    runLength, // Run length is still 0
                    table,
                );
            } else if (
                char == "." &&
                runLength > 0 &&
                c < conditions.length &&
                conditions[c] == runLength
            ) {
                // We've satisfied a condition, continue on...
                count += getPossibilities(
                    blocks,
                    i + 1, // Next block
                    conditions,
                    c + 1, // Next condition
                    0, // Restart run
                    table,
                );
            } else if (char == "#") {
                // We may be in the middle of a run,
                count += getPossibilities(
                    blocks,
                    i + 1, // Next block
                    conditions,
                    c, // Current condition
                    runLength + 1, // Increase run
                    table,
                );
            }
        }
    });
    table[key] = count;
    return count;
}

/**
 * Main execution function
 */
export function main(filename: string): number {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const filepath = `${currentDirectory}/${filename}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
    return answer;
}

main("input.txt");
