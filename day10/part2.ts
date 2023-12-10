import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 10: Pipe Maze
 * https://adventofcode.com/2023/day/10
 */
const process = (lines: string[]) => {
    let matrix: string[][] = [];
    let startingPoint: number[] = [0, 0];
    lines.forEach((line, row) => {
        console.log(line);
        matrix.push(line.split(""));
        if (line.includes("S")) {
            startingPoint = [row, line.indexOf("S")];
        }
    });
    let curr = startingPoint;
    // console.log("Starting at", curr);
    const validCoords = getValidCoords(startingPoint, matrix);
    const leftDistance = visit(startingPoint, validCoords[0], matrix, { [curr.toString()]: 0 }, 1);
    // console.log("\nReStarting at", curr);
    const rightDistance = visit(startingPoint, validCoords[1], matrix, { [curr.toString()]: 0 }, 1);
    // console.log("Left:", leftDistance);
    // console.log("Right:", rightDistance);
    const finalDistance: Record<string, number> = {};
    Object.keys(leftDistance).forEach((key) => {
        finalDistance[key] = Math.min(leftDistance[key], rightDistance[key]);
    });
    // Get boundaries of maze
    let minRow: number | null = null;
    let maxRow: number | null = null;
    let minCol: number | null = null;
    let maxCol: number | null = null;
    Object.keys(finalDistance).forEach((key) => {
        const [row, col] = key.split(",").map((x) => parseInt(x));
        minRow = Math.min(minRow || Number.MAX_VALUE, row);
        maxRow = Math.max(maxRow || 0, row);
        minCol = Math.min(minCol || Number.MAX_VALUE, col);
        maxCol = Math.max(maxCol || 0, col);
    });
    if (!minRow || !maxRow || !minCol || !maxCol) {
        console.log("Something went wrong");
        return;
    }
    const topLeft = [minRow, minCol];
    const bottomRight = [maxRow, maxCol];
    console.log(finalDistance);
    console.log("Boundaries", topLeft, bottomRight);
    console.log("********************************************\n\n");
    console.log(minRow, maxRow, minCol, maxCol);
    for (let i = minRow; i < maxRow + 1; i++) {
        for (let j = minCol; j < maxCol; j++) {
            console.log("Curr:", i, j, matrix[i][j]);
            if(matrix[i][j] !== ".") continue;
            if (isInLoop([i, j], matrix, finalDistance)) {
                console.log("\n\n************************************")
                console.log("Found bound tile", i, j);
                console.log("************************************\n\n")
            }
        }
    }
    return Math.max(...Object.values(finalDistance));
};

function isInLoop(coord: number[], matrix: string[][], distances: Record<string, number>): boolean {
    console.log("Searching", coord)
    if (coord.toString() in distances) {
        console.log("Found", coord, "in distances");
        return true;
    } else if (coord[0] >= matrix.length || coord[1] >= matrix[0].length) {
        console.log("Reached boundary", coord);
        return false;
    } else if (coord[0] < 0 || coord[1] < 0) {
        console.log("Reached boundary", coord);
        return false;
    } else if (matrix[coord[0]][coord[1]] !== ".") {
        console.log("Found non-tile", matrix[coord[0]][coord[1]], "at", coord);
        return false;
    }
    let northCounter = 1;
    let boundNorth = true;
    while(coord[0] - northCounter >= 0) {
        const check = tileCheck([coord[0] - northCounter, coord[1]], matrix, distances);
        if(!check) {
            boundNorth = false;
            break;
        }
        northCounter++;
    }
    let southCounter = 1;
    let boundSouth = true;
    while(coord[0] + southCounter < matrix.length) {
        const check = tileCheck([coord[0] + southCounter, coord[1]], matrix, distances);
        if(!check) {
            boundSouth = false;
            break;
        }
        southCounter++;
    }
    let eastCounter = 1;
    let boundEast = true;
    while(coord[1] + eastCounter < matrix[0].length) {
        const check = tileCheck([coord[0], coord[1] + eastCounter], matrix, distances);
        if(!check) {
            boundEast = false;
            break;
        }
        eastCounter++;
    }
    let westCounter = 1;
    let boundWest = true;
    while(coord[1] - westCounter >= 0) {
        const check = tileCheck([coord[0], coord[1] - westCounter], matrix, distances);
        if(!check) {
            boundWest = false;
            break;
        }
        westCounter++;
    }
    // const boundNorth = isInLoop([coord[0] - 1, coord[1]], matrix, distances);
    // const boundEast = isInLoop([coord[0], coord[1] + 1], matrix, distances);
    // const boundSouth = isInLoop([coord[0] + 1, coord[1]], matrix, distances);
    // const boundWest = isInLoop([coord[0], coord[1] - 1], matrix, distances);
    return boundNorth && boundEast && boundSouth && boundWest;
}

function tileCheck(coord: number[], matrix: string[][], distances: Record<string, number>): boolean {
    if (coord.toString() in distances) {
        console.log("Found", coord, "in distances");
        return true;
    } else if (coord[0] >= matrix.length || coord[1] >= matrix[0].length) {
        console.log("Reached boundary", coord);
        return false;
    } else if (coord[0] < 0 || coord[1] < 0) {
        console.log("Reached boundary", coord);
        return false;
    } else if (matrix[coord[0]][coord[1]] !== ".") {
        console.log("Found non-tile", matrix[coord[0]][coord[1]], "at", coord);
        return false;
    } else {
        console.log("UNKNOWN???");
        return true;
    }
}
function visit(
    start: number[],
    coord: number[],
    matrix: string[][],
    distance: Record<string, number>,
    step: number,
) {
    console.log("Visiting", coord, "(", step, ")");
    distance[coord.toString()] = step;
    const validCoords = getValidCoords(coord, matrix);
    console.log("Valid coords", validCoords);
    if (
        Object.keys(distance).includes(validCoords[0].toString()) &&
        Object.keys(distance).includes(validCoords[1].toString())
    ) {
        console.log("Done in ", step, "steps");
        console.log("********************************************\n\n");
        return distance;
    }
    const next = Object.keys(distance).includes(validCoords[1].toString())
        ? validCoords[0]
        : validCoords[1];
    console.log("Next is", next);
    console.log("----------------------------------------------");
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
        console.log("North is valid");
        validCoords.push(north);
    }
    if (validDirections.includes(EAST) && validEastBound.includes(matrix[east[0]][east[1]])) {
        console.log("East is valid");
        validCoords.push(east);
    }
    if (validDirections.includes(SOUTH) && validSouthBound.includes(matrix[south[0]][south[1]])) {
        console.log("South is valid");
        validCoords.push(south);
    }
    if (validDirections.includes(WEST) && validWestBound.includes(matrix[west[0]][west[1]])) {
        console.log("West is valid");
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

main("input.test2.txt");
