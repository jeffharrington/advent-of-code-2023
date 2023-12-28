import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 21: Step Counter
 * https://adventofcode.com/2023/day/21
 */
type Item = {
    coord: number[];
    step: number;
};

const process = (lines: string[]) => {
    const matrix = lines.map((line) => line.split(""));
    const startingPoint = lines.reduce((acc: number[][], line, row) => {
        const col = line.indexOf("S");
        if (col !== -1) {
            acc.push([row, col]);
        }
        return acc;
    }, [])[0];
    const queue: Item[] = [];
    const stepGoal = 64;
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
};

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
