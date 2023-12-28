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
    parity: boolean;
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
    const stepGoal = 50;
    const coordinates = new Set();
    queue.push({ coord: startingPoint, step: 0, parity: stepGoal % 2 === 0 });
    while (queue.length > 0) {
        const curr = queue.shift();
        if (curr === undefined) break;
        const coordKey = curr.coord.join(",");
        if (coordinates.has(coordKey)) continue;
        if (curr.step === stepGoal) {
            coordinates.add(coordKey);
            continue;
        }
        if (curr.parity === (stepGoal % 2 === 0) && curr.step % 2 === stepGoal % 2) {
            // Same parity
            coordinates.add(coordKey);
        } else if (curr.parity !== (stepGoal % 2 === 0) && curr.step % 2 !== stepGoal % 2) {
            // Different parity
            coordinates.add(coordKey);
        }

        const nextCoords = neighbors(curr.coord);
        nextCoords.forEach((nextCoord) => {
            let adjustedX = 0;
            if (nextCoord[0] < 0) {
                adjustedX = (matrix.length + (nextCoord[0] % matrix.length)) % matrix.length;
            } else {
                adjustedX = nextCoord[0] % matrix.length;
            }
            let adjustedY = 0;
            if (nextCoord[1] < 0) {
                adjustedY =
                    (matrix[0].length + (nextCoord[1] % matrix[0].length)) % matrix[0].length;
            } else {
                adjustedY = nextCoord[1] % matrix[0].length;
            }
            const numParitySwitch =
                Math.trunc(nextCoord[0] / matrix.length) +
                Math.trunc(nextCoord[1] / matrix[0].length);
            let nexParity = curr.parity;
            if (numParitySwitch % 2 === 0) {
                nexParity = curr.parity;
            } else {
                nexParity = !curr.parity;
            }
            // console.log(nextCoord, "->", [adjustedX, adjustedY]);
            if (matrix[adjustedX][adjustedY] === ".") {
                queue.push({ coord: nextCoord, step: curr.step + 1, parity: nexParity });
            }
        });
    }
    // console.log(coordinates);
    return coordinates.size;
};

function neighbors(coord: number[]) {
    const NORTH = [-1, 0];
    const SOUTH = [1, 0];
    const EAST = [0, 1];
    const WEST = [0, -1];
    return [NORTH, SOUTH, EAST, WEST].flatMap(([dx, dy]) => {
        const nextCoord = [coord[0] + dx, coord[1] + dy];
        return [nextCoord];
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

main("input.test.txt");
