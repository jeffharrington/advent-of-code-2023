import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, parse } from "path";

/**
 * Day 13: Point of Incidence
 * https://adventofcode.com/2023/day/13
 */
const process = (lines: string[]) => {
    const allPuzzles: string[][][] = [];
    let currPuzzle: string[][] = [];
    lines.forEach((line) => {
        if (line.length === 0) {
            allPuzzles.push(currPuzzle);
            currPuzzle = [];
        } else {
            currPuzzle.push(line.split(""));
        }
    });
    allPuzzles.push(currPuzzle);
    const sum = allPuzzles.reduce((acc, puzzle) => {
        const colsOfReflection = puzzle.reduce((acc: Set<number> | null, line) => {
            const points = getPointsOfReflection(line);
            if (acc == null) {
                return points;
            } else {
                return new Set([...acc].filter((x) => points.has(x)));
            }
        }, null);
        if (colsOfReflection !== null) {
            if (colsOfReflection.size > 1) {
                throw new Error("Multiple cols of reflection!");
            }
            if (colsOfReflection.size == 1) {
                const colValue = colsOfReflection.values().next().value + 1;
                return acc + colValue; // No need to analyze rows if we have a column of reflection
            }
        }
        const rowsOfReflection = transpose(puzzle).reduce((acc: Set<number> | null, line) => {
            const points = getPointsOfReflection(line);
            if (acc == null) {
                return points;
            } else {
                return new Set([...acc].filter((x) => points.has(x)));
            }
        }, null);
        if (rowsOfReflection !== null) {
            if (rowsOfReflection.size > 1) {
                throw new Error("Multiple rows of reflection!");
            }
            if (rowsOfReflection.size > 0) {
                const rowValue = (rowsOfReflection.values().next().value + 1) * 100;

                return acc + rowValue;
            }
        }
        throw new Error("No reflections found!");
    }, 0);
    return sum;
};

function transpose(matrix: string[][]): string[][] {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

export function getPointsOfReflection(line: string[]): Set<number> {
    return line.reduce((pointsOfReflection, _, index) => {
        let reflection = null;
        let left = index;
        let right = index + 1;
        while (left >= 0 && right < line.length) {
            if (line[left] === line[right]) {
                reflection = true;
            } else {
                reflection = false;
                break;
            }
            left -= 1;
            right += 1;
        }
        if (reflection) {
            pointsOfReflection.add(index);
        }
        return pointsOfReflection;
    }, new Set<number>());
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
