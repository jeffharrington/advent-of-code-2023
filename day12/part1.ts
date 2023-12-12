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
        const numPossibilities = getPossibilities(springs, conditions, 0, 0, 0, {});
        sum += numPossibilities;
    });
    return sum;
};

function getPossibilities(
    blocks: string[],
    conditions: number[],
    i: number, // Block index
    c: number, // Condition index
    runLen: number,
    table: Record<string, number>,
): number {
    // console.log("-------------------------------------------");
    // console.log(table);
    const key = [i, c, runLen].join(",");

    if (Object.keys(table).includes(key)) {
        return table[key];
    }

    if (i == blocks.length) {
        if (c == conditions.length && runLen == 0) {
            // We've reached the end and fit all the conditions
            return 1;
        } else if (c == conditions.length - 1 && conditions[c] == runLen) {
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
            if (char == "." && runLen == 0) {
                // We're not currently within a run of springs, continue on...
                count += getPossibilities(
                    blocks,
                    conditions,
                    i + 1, // Next spring
                    c, // Current condition
                    runLen, // Run length is still 0
                    table,
                );
            } else if (
                char == "." &&
                runLen > 0 &&
                c < conditions.length &&
                conditions[c] == runLen
            ) {
                // We've satisfied a condition, continue on...
                count += getPossibilities(
                    blocks,
                    conditions,
                    i + 1, // Next spring
                    c + 1, // Next condition
                    0, // Restart run
                    table,
                );
            } else if (char == "#") {
                // We may be in the middle of a run,
                count += getPossibilities(
                    blocks,
                    conditions,
                    i + 1, // Next spring
                    c, // Current condition
                    runLen + 1, // Increase run
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
