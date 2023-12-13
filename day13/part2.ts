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
    const sum = allPuzzles.reduce((acc, puzzle, puzzle_index) => {
        // Get original points of reflection
        const origColOfReflection = getPointsOfReflection(puzzle);
        const origRowOfReflection = getPointsOfReflection(transpose(puzzle));
        for (let i = 0; i < puzzle.length; i++) {
            for (let j = 0; j < puzzle[i].length; j++) {
                const smudgedPuzzle = puzzle.map((row) => row.slice());
                smudgedPuzzle[i][j] = smudgedPuzzle[i][j] === "#" ? "." : "#";
                // Find Columns of Reflection in smudged puzzle
                const colsOfReflection = getPointsOfReflection(smudgedPuzzle);
                const colOfReflection = difference(colsOfReflection, origColOfReflection);
                if(colsOfReflection.size > 1) {
                    console.log([...colOfReflection], "vs", [...colsOfReflection], "(", [...origColOfReflection], ")");
                }
                if (colOfReflection.size == 1) {
                    const colValue = [...colOfReflection][0];
                    return acc + (colValue + 1);
                }
                // Find Rows of Reflection in smudged puzzle
                const rowsOfReflection = getPointsOfReflection(transpose(smudgedPuzzle));
                const rowOfReflection = difference(rowsOfReflection, origRowOfReflection);
                if (rowOfReflection.size == 1) {
                    const rowValue = [...rowOfReflection][0];
                    return acc + (rowValue + 1) * 100;
                }
            }
        }
        return acc;
    }, 0);
    return sum;
};

function transpose(matrix: string[][]): string[][] {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function difference(setA: Set<number>, setB: Set<number>): Set<number> {
    return new Set([...setA].filter((x) => !setB.has(x)));
}

function getPointsOfReflection(puzzle: string[][]): Set<number> {
    const commonPointsOfReflection = puzzle.reduce((acc: Set<number> | null, line) => {
        const points = findPointsOfReflection(line);
        if (acc == null) {
            return points;
        } else {
            return new Set([...acc].filter((x) => points.has(x)));
        }
    }, null);
    if (commonPointsOfReflection !== null && commonPointsOfReflection?.size > 0) {
        return commonPointsOfReflection;
    }
    return new Set([]); // No common points of reflection found
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
