import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 10: Pipe Maze
 * https://adventofcode.com/2023/day/10
 */
const process = (lines: string[]) => {
    const matrix: string[][] = lines.map((line) => line.split(""));
    const startingPoint = matrix.flatMap((row, row_index) => {
        const colIndex = row.indexOf("S");
        if (colIndex !== -1) {
            return [row_index, colIndex];
        } else {
            return [];
        }
    });
    const nodes = getNodes(startingPoint, matrix);
    const leftDistances = visit(nodes[0], matrix, { [startingPoint.toString()]: 0 }, 1);
    const rightDistances = visit(nodes[1], matrix, { [startingPoint.toString()]: 0 }, 1);
    const bestDistances = Object.keys(leftDistances).reduce((acc: Record<string, number>, key) => {
        acc[key] = Math.min(leftDistances[key], rightDistances[key]);
        return acc;
    }, {});
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            const coord = [i, j];
            if (bestDistances[coord.toString()] !== undefined) continue;
            const isBoundedCell = isBounded(coord, matrix, bestDistances);
            if (!isBoundedCell) {
                matrix[i][j] = "0";
                fillUnboundedNorth([i, j], matrix, bestDistances);
                fillUnboundedEast([i, j], matrix, bestDistances);
                fillUnboundedSouth([i, j], matrix, bestDistances);
                fillUnboundedWest([i, j], matrix, bestDistances);
            } else {
                matrix[i][j] = "I";
            }
        }
    }
    matrix.forEach((row) => console.log(row.join("")));
    return Math.max(...Object.values(bestDistances));
};

function fillUnboundedEast(coord: number[], matrix: string[][], distances: Record<string, number>) {
    if(matrix[coord[0]][coord[1]] !== "0") {
        console.log("OOOPS!");
    }
    // Check East bound
    console.log("Going East....");
    for (let i = coord[1]; i < matrix[0].length; i++) {
        const nextCoordKey = [coord[0], i].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            break;
        } else {
            matrix[coord[0]][i] = "0";
        }
    }
}

function fillUnboundedNorth(coord: number[], matrix: string[][], distances: Record<string, number>) {
    if(matrix[coord[0]][coord[1]] !== "0") {
        console.log("OOOPS!");
    }
    // Check North bound
    console.log("Going North....");
    for (let i = coord[0]; i >= 0; i--) {
        const nextCoordKey = [i, coord[1]].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            break;
        } else {
            matrix[i][coord[1]] = "0";
        }
    }
}

function fillUnboundedSouth(coord: number[], matrix: string[][], distances: Record<string, number>) {
    if(matrix[coord[0]][coord[1]] !== "0") {
        console.log("OOOPS!");
    }
    // Check South bound
    console.log("Going South....");
    for (let i = coord[0]; i < matrix.length; i++) {
        const nextCoordKey = [i, coord[1]].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            break;
        } else {
            matrix[i][coord[1]] = "0";
        }
    }
}

function fillUnboundedWest(coord: number[], matrix: string[][], distances: Record<string, number>) {
    if(matrix[coord[0]][coord[1]] !== "0") {
        console.log("OOOPS!");
    }
    // Check West bound
    console.log("Going West....");
    for (let i = coord[1]; i >= 0; i--) {
        const nextCoordKey = [coord[0], i].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            break;
        } else {
            matrix[coord[0]][i] = "0";
        }
    }
}

function visit(coord: number[], matrix: string[][], visited: Record<string, number>, step: number) {
    visited[coord.toString()] = step;
    const nodes = getNodes(coord, matrix);
    if (
        Object.keys(visited).includes(nodes[0].toString()) &&
        Object.keys(visited).includes(nodes[1].toString())
    ) {
        return visited;
    }
    const next = Object.keys(visited).includes(nodes[1].toString()) ? nodes[0] : nodes[1];
    return visit(next, matrix, visited, step + 1);
}

function getNodes(coord: number[], matrix: string[][]): number[][] {
    const NORTH = [-1, 0];
    const SOUTH = [1, 0];
    const EAST = [0, 1];
    const WEST = [0, -1];
    const validOutputs: Record<string, number[][]> = {
        "|": [SOUTH, NORTH],
        "-": [EAST, WEST],
        "L": [NORTH, EAST],
        "J": [NORTH, WEST],
        "7": [SOUTH, WEST],
        "F": [SOUTH, EAST],
        "S": [SOUTH, NORTH, WEST, EAST],
    };
    const validInputs: Record<string, string[]> = {
        [NORTH.toString()]: ["|", "7", "F", "S"],
        [SOUTH.toString()]: ["|", "J", "L", "S"],
        [EAST.toString()]: ["-", "J", "7", "S"],
        [WEST.toString()]: ["-", "F", "L", "S"],
    };
    const shape = matrix[coord[0]][coord[1]];
    const nodeCoords = validOutputs[shape].flatMap((direction) => {
        const nextCoord = [coord[0] + direction[0], coord[1] + direction[1]];
        const nextShape = matrix[nextCoord[0]][nextCoord[1]];
        if (validInputs[direction.toString()].includes(nextShape)) {
            return [nextCoord];
        } else {
            return [];
        }
    });
    return nodeCoords;
}

function isBounded(
    coord: number[],
    matrix: string[][],
    distances: Record<string, number>,
): boolean {
    console.log("-------------------------------------------");
    console.log("Checking", coord.toString());
    // Check North bound
    let boundNorth = false;
    console.log("Going North....");
    for (let i = coord[0]; i >= 0; i--) {
        const nextCoordKey = [i, coord[1]].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            console.log("Bounded to the North at", nextCoordKey);
            boundNorth = true;
            break;
        } else if(matrix[i][coord[1]] === "0") {
            boundNorth = false;
            break;
        }
    }
    // Check South bound
    let boundSouth = false;
    console.log("Going South....");
    for (let i = coord[0]; i < matrix.length; i++) {
        const nextCoordKey = [i, coord[1]].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            console.log("Bounded to the South at", nextCoordKey);
            boundSouth = true;
            break;
        } else if(matrix[i][coord[1]] === "0") {
            boundSouth = false;
            break;
        }
    }
    // Check East bound
    let boundEast = false;
    console.log("Going East....");
    for (let i = coord[1]; i < matrix[0].length; i++) {
        const nextCoordKey = [coord[0], i].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            console.log("Bounded to the East at", nextCoordKey);
            boundEast = true;
            break;
        } else if(matrix[coord[0]][i] === "0") {
            boundEast = false;
            break;
        }
    }
    // Check West bound
    let boundWest = false;
    console.log("Going West....");
    for (let i = coord[1]; i >= 0; i--) {
        const nextCoordKey = [coord[0], i].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            console.log("Bounded to the West at", nextCoordKey);
            boundWest = true;
            break;
        } else if(matrix[coord[0]][i] === "0") {
            boundWest = false;
            break;
        }
    }
    return boundNorth && boundSouth && boundEast && boundWest;
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

main("input.test3.txt");
