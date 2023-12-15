import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, parse } from "path";

/**
 * Day 14: Parabolic Reflector Dish
 * https://adventofcode.com/2023/day/14
 */
const process = (lines: string[]) => {
    let matrix = lines.map((line) => line.split(""));
    const setCycles: Record<string, number> = {};
    const sumCycles: Record<string, number> = {};
    const targetCycles = 1000000000;
    let cycleStart = null;
    let cycleEnd = null;
    let startingKey = null;

    for (let i = 0; i < targetCycles; i++) {
        matrix = tilt(rotateClockwise(matrix)); // Tilt North
        matrix = tilt(rotateClockwise(matrix)); // Tilt West
        matrix = tilt(rotateClockwise(matrix)); // Tilt South
        matrix = tilt(rotateClockwise(matrix)); // Tilt East

        sumCycles[i] = sumMatrix(
            rotateCounterClockwise(rotateCounterClockwise(rotateCounterClockwise(matrix))),
        );

        const key = matrixKey(matrix);
        if (setCycles[key] !== undefined) {
            if (cycleStart == null) {
                cycleStart = i;
                startingKey = key;
            } else if (key == startingKey) {
                cycleEnd = i;
                break;
            }
        } else {
            setCycles[key] = i;
        }
    }

    if (!cycleStart || !cycleEnd) throw new Error("No cycle found!");

    const cycleLength = cycleEnd - cycleStart;
    const trueStart = cycleStart - cycleLength;
    const target = (targetCycles - trueStart) % cycleLength;
    const targetIndex = trueStart + target - 1;

    return sumCycles[targetIndex];
};

function matrixKey(matrix: string[][]): string {
    return matrix.map((x) => x.join("")).join("");
}

function sumMatrix(matrix: string[][]): number {
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j] === "O") {
                sum += j + 1;
            }
        }
    }
    return sum;
}

function tilt(matrix: string[][]): string[][] {
    const tiltedMatrix = Array.from(matrix);
    for (let i = 0; i < tiltedMatrix.length; i++) {
        let openStack: number[] = [];
        for (let j = tiltedMatrix.length - 1; j >= 0; j--) {
            if (tiltedMatrix[i][j] === ".") {
                openStack.push(j);
            } else if (tiltedMatrix[i][j] === "O") {
                if (openStack.length > 0) {
                    const bestOpen = openStack.shift();
                    if (!bestOpen) throw new Error("No best open found!");
                    tiltedMatrix[i][j] = ".";
                    tiltedMatrix[i][bestOpen] = "O";
                    openStack.push(j);
                }
            } else if (tiltedMatrix[i][j] === "#") {
                // Pop the rest off
                openStack = [];
            }
        }
    }
    return tiltedMatrix;
}

export function rotateClockwise(matrix: string[][]): string[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotatedMatrix: string[][] = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            rotatedMatrix[j][rows - 1 - i] = matrix[i][j];
        }
    }
    return rotatedMatrix;
}

export function rotateCounterClockwise(matrix: string[][]): string[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotatedMatrix: string[][] = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            rotatedMatrix[cols - 1 - j][i] = matrix[i][j];
        }
    }
    return rotatedMatrix;
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
