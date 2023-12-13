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
        const colOfReflection = getPointOfReflection(puzzle);
        if (colOfReflection !== null) {
            return acc + (colOfReflection + 1);
        }
        const rowsOfReflection = getPointOfReflection(transpose(puzzle));
        if (rowsOfReflection !== null) {
            return acc + (rowsOfReflection + 1) * 100;
        }
        throw new Error("No reflections found!");
    }, 0);
    return sum;
};

function transpose(matrix: string[][]): string[][] {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function getPointOfReflection(puzzle: string[][]): number | null {
    const commonPointsOfReflection = puzzle.reduce((acc: Set<number> | null, line) => {
        const points = findPointsOfReflection(line);
        if (acc == null) {
            return points;
        } else {
            return new Set([...acc].filter((x) => points.has(x)));
        }
    }, null);
    if (commonPointsOfReflection !== null) {
        if (commonPointsOfReflection.size > 1) {
            throw new Error("Multiple common points of reflection!");
        } else if (commonPointsOfReflection.size == 1) {
            return [...commonPointsOfReflection][0];
        }
    }
    return null; // No common points of reflection found
}

export function findPointsOfReflection(line: string[]): Set<number> {
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
