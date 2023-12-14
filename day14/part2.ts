import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, parse } from "path";

/**
 * Day 14: Parabolic Reflector Dish
 * https://adventofcode.com/2023/day/14
 */
const process = (lines: string[]) => {
    let matrix = lines.map((line) => line.split(""));
    console.log(matrix.map((line) => line.join("")).join("\n"));
    console.log("---");

    const setCycles: Record<string, number> = {};
    let lastCycleDirection = "";
    for (let i = 0; i < 1000000000; i++) {
        console.log("Cycle", i + 1);

        lastCycleDirection = "North";
        let rotatedNorth = rotateClockwise(matrix); // Rotate North
        let tiltedNorthMatrix = tilt(rotatedNorth);
        const titledNorthMatrixKey = matrixKey(tiltedNorthMatrix);
        if (setCycles[titledNorthMatrixKey] !== undefined) {
            console.log("Cycle detected at tiltedNorthMatrix", setCycles[titledNorthMatrixKey], i + 1);
            break;
        } else {
            setCycles[titledNorthMatrixKey] = i;
        }
        // console.log("Tilted North...");
        // console.log(
        //     rotateCounterClockwise(tiltedNorthMatrix)
        //         .map((line) => line.join(""))
        //         .join("\n"),
        // );
        // console.log("\n\n");
        // if (matrixEqual(originalMatrix, rotateCounterClockwise(tiltedNorthMatrix))) {
        //     console.log("Cycle detected at tiltedNorthMatrix", i);
        //     break;
        // }

        lastCycleDirection = "West";
        let rotatedWestMatrix = rotateClockwise(tiltedNorthMatrix);
        let tiltedWestMatrix = tilt(rotatedWestMatrix);
        const tiltedWestMatrixKey = matrixKey(tiltedWestMatrix);
        if (setCycles[tiltedWestMatrixKey] !== undefined) {
            console.log("Cycle detected at tiltedWestMatrixKey", setCycles[tiltedWestMatrixKey], i + 1);
            break;
        } else {
            setCycles[tiltedWestMatrixKey] = i;
        }

        // console.log("Tilted West...");
        // console.log(
        //     rotateCounterClockwise(rotateCounterClockwise(tiltedWestMatrix))
        //         .map((line) => line.join(""))
        //         .join("\n"),
        // );
        // console.log("\n\n");
        // if (
        //     matrixEqual(
        //         originalMatrix,
        //         rotateCounterClockwise(rotateCounterClockwise(tiltedWestMatrix)),
        //     )
        // ) {
        //     console.log("Cycle detected at tiltedWestMatrix", i);
        //     break;
        // }

        lastCycleDirection = "South";
        let rotatedSouthMatrix = rotateClockwise(tiltedWestMatrix);
        let tiltedSouthMatrix = tilt(rotatedSouthMatrix);
        const tiltedSouthMatrixKey = matrixKey(tiltedSouthMatrix);
        if (setCycles[tiltedSouthMatrixKey] !== undefined) {
            console.log("Cycle detected at tiltedSouthMatrix", setCycles[tiltedSouthMatrixKey], i + 1);
            break;
        } else {
            setCycles[tiltedSouthMatrixKey] = i;
        }

        // console.log("Tilted South...");
        // console.log(
        //     rotateCounterClockwise(rotateCounterClockwise(rotateCounterClockwise(tiltedSouthMatrix)))
        //         .map((line) => line.join(""))
        //         .join("\n"),
        // );
        // console.log("\n\n");
        // if (
        //     matrixEqual(
        //         originalMatrix,
        //         rotateCounterClockwise(
        //             rotateCounterClockwise(rotateCounterClockwise(tiltedSouthMatrix)),
        //         ),
        //     )
        // ) {
        //     console.log("Cycle detected at tiltedSouthMatrix", i);
        //     break;
        // }

        lastCycleDirection = "East";
        let rotatedEastMatrix = rotateClockwise(tiltedSouthMatrix);
        let tiltedEastMatrix = tilt(rotatedEastMatrix);
        const tiltedEastMatrixKey = matrixKey(tiltedEastMatrix);
        if (setCycles[tiltedEastMatrixKey] !== undefined) {
            console.log("Cycle detected at tiltedEastMatrix", setCycles[tiltedEastMatrixKey], i + 1);
            break;
        } else {
            setCycles[tiltedEastMatrixKey] = i;
        }

        // console.log("Tilted East... Cycle", i + 1);
        // console.log(
        //     rotateCounterClockwise(
        //         rotateCounterClockwise(
        //             rotateCounterClockwise(rotateCounterClockwise(tiltedEastMatrix)),
        //         ),
        //     )
        //         .map((line) => line.join(""))
        //         .join("\n"),
        // );
        // console.log("\n\n");
        // if (
        //     matrixEqual(
        //         originalMatrix,
        //         rotateCounterClockwise(
        //             rotateCounterClockwise(
        //                 rotateCounterClockwise(rotateCounterClockwise(tiltedEastMatrix)),
        //             ),
        //         ),
        //     )
        // ) {
        //     console.log("Cycle detected at tiltedEastMatrix", i);
        //     break;
        // }

        matrix = tiltedEastMatrix;
    }

    console.log("lastCycleDirection", lastCycleDirection);
    console.log(
        rotateCounterClockwise(tiltedNorthMatrix)
            .map((line) => line.join(""))
            .join("\n"),
    );
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j] === "O") {
                sum += j + 1;
            }
        }
    }
    return sum;
};

function matrixKey(matrix: string[][]): string {
    return matrix.map((x) => x.join("")).join("");
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

function rotateCounterClockwise(matrix: string[][]): string[][] {
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

main("input.test.txt");
