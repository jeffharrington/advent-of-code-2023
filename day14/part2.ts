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
    let cycleStart = null;
    let startingKey = null;
    let cycleEnd = null;
    for (let i = 0; i < 1000000000; i++) {
        matrix = tilt(rotateClockwise(matrix));  // Tilt North
        matrix = tilt(rotateClockwise(matrix));  // Tilt West
        matrix = tilt(rotateClockwise(matrix));  // Tilt South
        matrix = tilt(rotateClockwise(matrix));  // Tilt East

        const matrixToSum = rotateCounterClockwise(
            rotateCounterClockwise(rotateCounterClockwise(matrix)),
        );
        const sum = sumMatrix(matrixToSum);
        sumCycles[i] = sum;

        const key = matrixKey(matrix);
        if (setCycles[key] !== undefined) {
            console.log("Cycle detected after loop", i);
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
    console.log("True Start:", trueStart);
    console.log("Cycle length", cycleLength);
    const target = (1000000000 - trueStart) % cycleLength;
    console.log("Target #", target);
    const targetIndex = trueStart + target - 1;
    console.log("Target Index:", targetIndex);
    console.log("Found:", sumCycles[targetIndex]);
    return sumCycles[targetIndex];
    // console.log("lastCycleDirection", lastCycleDirection);
    // let finalMatrix = null;
    // if (lastCycleDirection === "North") {
    //     finalMatrix = matrix;
    // } else if (lastCycleDirection === "West") {
    //     finalMatrix = rotateCounterClockwise(matrix);
    // } else if (lastCycleDirection === "South") {
    //     finalMatrix = rotateCounterClockwise(rotateCounterClockwise(matrix));
    // } else if (lastCycleDirection === "East") {
    //     finalMatrix = rotateCounterClockwise(
    //         rotateCounterClockwise(rotateCounterClockwise(matrix)),
    //     );
    // }
    // if (!finalMatrix) throw new Error("No final matrix found!");
    // // console.log("~~~~~ FINAL ~~~~~~~~");
    // // console.log(finalMatrix.map((line) => line.join("")).join("\n"));
    // // console.log("\n\n");

    // const sum = sumMatrix(finalMatrix);
    // return sum;
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

export function matrixEqual(matrixA: string[][], matrixB: string[][]): boolean {
    if (matrixA.length !== matrixB.length) return false;
    if (matrixA[0].length !== matrixB[0].length) return false;
    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixA[0].length; j++) {
            if (matrixA[i][j] !== matrixB[i][j]) {
                return false;
            }
        }
    }
    return true;
}
function tilt(matrix: string[][]): string[][] {
    const tiltedMatrix = Array.from(matrix);
    for (let i = 0; i < tiltedMatrix.length; i++) {
        let openStack: number[] = [];
        for (let j = tiltedMatrix.length - 1; j >= 0; j--) {
            // console.log("-------------------------------------------");
            // console.log(
            //     `i=${i}, j=${j}, rotatedMatrix[i][j]=${tiltedMatrix[i][j]}, openStack=${openStack}`,
            // );
            // console.log(tiltedMatrix.map((line) => line.join("")).join("\n"));
            // console.log("\n");
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
    // Create a new matrix with the same dimensions
    const rotatedMatrix: string[][] = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // Rotate each element to its new position
            rotatedMatrix[j][rows - 1 - i] = matrix[i][j];
        }
    }
    return rotatedMatrix;
}

export function rotateCounterClockwise(matrix: string[][]): string[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    // Create a new matrix with the same dimensions
    const rotatedMatrix: string[][] = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // Rotate each element to its new position
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
