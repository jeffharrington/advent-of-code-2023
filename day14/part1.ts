import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, parse } from "path";

/**
 * Day 14: Parabolic Reflector Dish
 * https://adventofcode.com/2023/day/14
 */
const process = (lines: string[]) => {
    const matrix = lines.map((line) => line.split(""));
    const rotatedMatrix = rotateClockwise(matrix); // Rotate North
    const tiltedMatrix = tilt(rotatedMatrix);
    let sum = 0;
    for (let i = 0; i < tiltedMatrix.length; i++) {
        for (let j = 0; j < tiltedMatrix.length; j++) {
            if (tiltedMatrix[i][j] === "O") {
                sum += j + 1;
            }
        }
    }
    return sum;
};

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

function rotateClockwise(matrix: string[][]): string[][] {
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
