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
    const leftDistance = visit(nodes[0], matrix, { [startingPoint.toString()]: 0 }, 1);
    const rightDistance = visit(nodes[1], matrix, { [startingPoint.toString()]: 0 }, 1);
    const bestDistances = Object.keys(leftDistance).map((key) =>
        Math.min(leftDistance[key], rightDistance[key]),
    );
    return Math.max(...bestDistances);
};

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
    const allowedDirectionsMap: Record<string, number[][]> = {
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
    const shape = matrix[coord[0]][coord[1]];
    const allowedDirections = allowedDirectionsMap[shape];
    let validCoords = [];
    if (allowedDirections.includes(NORTH)) {
        const northCoord = [coord[0] - 1, coord[1]];
        if (validNorthBound.includes(matrix[northCoord[0]][northCoord[1]])) {
            validCoords.push(northCoord);
        }
    }
    if (allowedDirections.includes(EAST)) {
        const eastCoord = [coord[0], coord[1] + 1];
        if (validEastBound.includes(matrix[eastCoord[0]][eastCoord[1]])) {
            validCoords.push(eastCoord);
        }
    }
    if (allowedDirections.includes(SOUTH)) {
        const southCoord = [coord[0] + 1, coord[1]];
        if (validSouthBound.includes(matrix[southCoord[0]][southCoord[1]])) {
            validCoords.push(southCoord);
        }
    }
    if (allowedDirections.includes(WEST)) {
        const westCoord = [coord[0], coord[1] - 1];
        if (validWestBound.includes(matrix[westCoord[0]][westCoord[1]])) {
            validCoords.push(westCoord);
        }
    }
    return validCoords;
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
