import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 10: Pipe Maze
 * https://adventofcode.com/2023/day/10
 */
const process = (lines: string[]) => {
    let matrix: string[][] = [];
    const distance: Record<string, number> = {};
    let startingPoint: number[] = [0, 0];
    lines.forEach((line, row) => {
        matrix.push(line.split(""));
        if (line.includes("S")) {
            startingPoint = [row, line.indexOf("S")];
        }
    });
    let curr = startingPoint;
    const validCoords = getValidCoords(startingPoint, matrix);
    const leftDistance = visit(startingPoint, validCoords[0], matrix, { [curr.toString()]: 0 }, 1);
    const rightDistance = visit(startingPoint, validCoords[1], matrix, { [curr.toString()]: 0 }, 1);
    const finalDistance: Record<string, number> = {};
    Object.keys(leftDistance).forEach((key) => {
        finalDistance[key] = Math.min(leftDistance[key], rightDistance[key]);
    });
    return Math.max(...Object.values(finalDistance));
};

function visit(
    start: number[],
    coord: number[],
    matrix: string[][],
    distance: Record<string, number>,
    step: number,
) {
    distance[coord.toString()] = step;
    const validCoords = getValidCoords(coord, matrix);
    if (
        Object.keys(distance).includes(validCoords[0].toString()) &&
        Object.keys(distance).includes(validCoords[1].toString())
    ) {
        return distance;
    }
    const next = Object.keys(distance).includes(validCoords[1].toString())
        ? validCoords[0]
        : validCoords[1];
    return visit(start, next, matrix, distance, step + 1);
}

function getValidCoords(coord: number[], matrix: string[][]): number[][] {
    const NORTH = [-1, 0];
    const SOUTH = [1, 0];
    const EAST = [0, 1];
    const WEST = [0, -1];
    const directionMap: Record<string, number[][]> = {
        "|": [SOUTH, NORTH],
        "-": [EAST, WEST],
        "L": [NORTH, EAST],
        "J": [NORTH, WEST],
        "7": [SOUTH, WEST],
        "F": [SOUTH, EAST],
        "S": [SOUTH, NORTH, WEST, EAST],
    };
    const validNorthBound = ["|", "7", "F", "S"];
    const validSouthBound = ["|", "J", "L", "S"];
    const validEastBound = ["-", "J", "7", "S"];
    const validWestBound = ["-", "F", "L", "S"];
    const north = getNorth(coord);
    const east = getEast(coord);
    const south = getSouth(coord);
    const west = getWest(coord);
    let validCoords = [];
    const shape = matrix[coord[0]][coord[1]];
    const validDirections = directionMap[shape];
    if (validDirections.includes(NORTH) && validNorthBound.includes(matrix[north[0]][north[1]])) {
        validCoords.push(north);
    }
    if (validDirections.includes(EAST) && validEastBound.includes(matrix[east[0]][east[1]])) {
        validCoords.push(east);
    }
    if (validDirections.includes(SOUTH) && validSouthBound.includes(matrix[south[0]][south[1]])) {
        validCoords.push(south);
    }
    if (validDirections.includes(WEST) && validWestBound.includes(matrix[west[0]][west[1]])) {
        validCoords.push(west);
    }
    return validCoords;
}

function getNorth(coord: number[]): number[] {
    return [coord[0] - 1, coord[1]];
}

function getSouth(coord: number[]): number[] {
    return [coord[0] + 1, coord[1]];
}

function getEast(coord: number[]): number[] {
    return [coord[0], coord[1] + 1];
}

function getWest(coord: number[]): number[] {
    return [coord[0], coord[1] - 1];
}

/**
 * Main execution function
 */
function main(filename: string): number {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const filepath = `${currentDirectory}/${filename}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
    return answer;
}

main("input.txt");
