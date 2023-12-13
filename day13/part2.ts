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
        console.log("----------------------------------------------------");
        console.log("Current sum:", acc);
        console.log(puzzle.map((row) => row.join("")).join("\n") + "\n");
        // const origColOfReflection = getPointOfReflection(puzzle);
        // const origRowOfReflection = getPointOfReflection(transpose(puzzle));
        const origColOfReflection = getPointsOfReflection(puzzle);
        const origRowOfReflection = getPointsOfReflection(transpose(puzzle));
        console.log("origColOfReflection", origColOfReflection);
        console.log("origRowOfReflection", origRowOfReflection);
        for (let i = 0; i < puzzle.length; i++) {
            for (let j = 0; j < puzzle[i].length; j++) {
                // Get original points of reflection
                // Get smudged points of reflection
                const smudgedPuzzle = puzzle.map((row) => row.slice());
                smudgedPuzzle[i][j] = smudgedPuzzle[i][j] === "#" ? "." : "#";
                const colsOfReflection = getPointsOfReflection(smudgedPuzzle);
                const colOfReflection = difference(colsOfReflection, origColOfReflection);
                if (colOfReflection.size > 1) {
                    throw new Error("Multiple column points of reflection!");
                }
                if (colOfReflection.size == 1) {
                    const colValue = [...colOfReflection][0];
                    console.log("colOfReflection for puzzleCopy", i, j, ":", colValue);
                    return acc + (colValue + 1);
                }
                // const colOfReflection = getPointOfReflection(smudgedPuzzle);
                // if (colOfReflection !== null && colOfReflection !== origColOfReflection) {
                //     console.log("colOfReflection for puzzleCopy", i, j, ":", colOfReflection);
                //     return acc + (colOfReflection + 1);
                // }
                const rowsOfReflection = getPointsOfReflection(transpose(smudgedPuzzle));
                const rowOfReflection = difference(rowsOfReflection, origRowOfReflection);
                if (rowOfReflection.size > 1) {
                    throw new Error("Multiple row points of reflection!");
                }
                if (rowOfReflection.size == 1) {
                    const rowValue = [...rowOfReflection][0];
                    console.log("rowOfReflection for puzzleCopy", i, j, ":", rowValue);
                    return acc + (rowValue + 1) * 100;
                }
                // const rowOfReflection = getPointOfReflection(transpose(smudgedPuzzle));
                // if (rowOfReflection !== null && rowOfReflection !== origRowOfReflection) {
                //     console.log("rowOfReflection for puzzleCopy", i, j, ":", rowOfReflection);
                //     return acc + (rowOfReflection + 1) * 100;
                // }
            }
        }
        if (origColOfReflection !== null && origRowOfReflection.size > 0) {
            console.log("Using origColOfReflection", origColOfReflection);
            const colValue = [...origColOfReflection][0];
            return acc + (colValue + 1);
        } else if (origRowOfReflection !== null && origRowOfReflection.size > 0) {
            console.log("Using origRowOfReflection", origRowOfReflection);
            const rowValue = [...origRowOfReflection][0];
            return acc + (rowValue + 1) * 100;
        }
        throw new Error(`No reflections found for puzzle ${puzzle_index}`);
    }, 0);
    return sum;
};

function transpose(matrix: string[][]): string[][] {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function difference(setA: Set<number>, setB: Set<number>): Set<number> {
    return new Set([...setA].filter((x) => !setB.has(x)));
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
            console.log("Multiple common points of reflection!");
            return null; // revisit
        } else if (commonPointsOfReflection.size == 1) {
            return [...commonPointsOfReflection][0];
        }
    }
    return null; // No common points of reflection found
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
    if (commonPointsOfReflection !== null) {
        if (commonPointsOfReflection.size > 1) {
            console.log("Multiple common points of reflection!");
        }
        if (commonPointsOfReflection.size > 0) {
            return commonPointsOfReflection; // revisit
        }
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
