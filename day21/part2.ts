import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as math from "mathjs";

/**
 * Day 21: Step Counter
 * https://adventofcode.com/2023/day/21
 */
type Item = {
    coord: number[];
    step: number;
};

const process = (lines: string[]) => {
    const initialMatrix = lines.map((line) => line.split(""));
    let matrix: string[][] = [];
    for (let i = 0; i < 5; i++) {
        initialMatrix.forEach((line) => {
            const newLine = line.map((char) => (char === "S" ? "." : char));
            matrix.push([...newLine, ...newLine, ...newLine, ...newLine, ...newLine]);
        });
    }
    const startingPoint = [Math.trunc(matrix.length / 2), Math.trunc(matrix[0].length / 2)];
    // Stolen from: https://gist.github.com/dllu/0ca7bfbd10a199f69bcec92f067ec94c#file-21-py-L69
    const a0 = stepFn(matrix, startingPoint, 65);
    const a1 = stepFn(matrix, startingPoint, 65 + 131);
    const a2 = stepFn(matrix, startingPoint, 65 + 2 * 131);
    const vandermonde = math.matrix([
        [0, 0, 1],
        [1, 1, 1],
        [4, 2, 1],
    ]);
    const b = math.flatten(math.matrix([[a0, a1, a2]]));
    const xs = math.flatten(math.lusolve(vandermonde, b).toArray());
    const n = 202300;
    const [x0, x1, x2] = xs as number[];
    const result = x0 * n * n + x1 * n + x2;
    return result;
};

function stepFn(matrix: string[][], startingPoint: number[], stepGoal: number) {
    const queue: Item[] = [];
    const coordinates = new Set();
    queue.push({ coord: startingPoint, step: 0 });
    while (queue.length > 0) {
        const curr = queue.shift();
        if (curr === undefined) break;
        const coordKey = curr.coord.join(",");
        if (coordinates.has(coordKey)) continue;
        if (curr.step === stepGoal) {
            coordinates.add(coordKey);
            continue;
        }
        if (curr.step % 2 === stepGoal % 2) {
            // Same parity
            coordinates.add(coordKey);
        }
        const nextCoords = validNeighbors(matrix, curr.coord);
        nextCoords.forEach((nextCoord) => {
            if (matrix[nextCoord[0]][nextCoord[1]] === ".") {
                queue.push({ coord: nextCoord, step: curr.step + 1 });
            }
        });
    }
    return coordinates.size;
}

function validNeighbors(matrix: string[][], coord: number[]) {
    const NORTH = [-1, 0];
    const SOUTH = [1, 0];
    const EAST = [0, 1];
    const WEST = [0, -1];
    return [NORTH, SOUTH, EAST, WEST].flatMap(([dx, dy]) => {
        if (
            coord[0] + dx >= 0 &&
            coord[0] + dx < matrix.length &&
            coord[1] + dy >= 0 &&
            coord[1] + dy < matrix[0].length
        ) {
            const nextCoord = [coord[0] + dx, coord[1] + dy];
            return [nextCoord];
        } else {
            return [];
        }
    });
}

/**
 * Main execution function
 */
export function main(filename: string): number {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const filepath = `${currentDirectory}/${filename}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const startTime = new Date().getTime();
    const answer = process(lines);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(answer);
    console.log("Finished in", elapsedTime, "ms");
    return answer;
}

main("input.txt");
