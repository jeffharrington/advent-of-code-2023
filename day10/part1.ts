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
    return Math.max(...Object.values(bestDistances));
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
