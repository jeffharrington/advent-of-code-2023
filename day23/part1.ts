import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 23: A Long Walk
 * https://adventofcode.com/2023/day/23
 */
const process = (lines: string[]) => {
    const matrix = lines.map((line) => line.split(""));
    const maxDistance = dfs(matrix, [0, 1], new Set<string>(), 0);
    return maxDistance;
};

function dfs(matrix: string[][], coord: number[], visited: Set<string>, distance: number) {
    if (visited.has(coord.toString())) return distance;
    if (coord[0] === matrix.length - 1 && coord[1] === matrix[0].length - 2) {
        return distance;
    }
    visited.add(coord.toString());
    const neighbors = validNeighbors(matrix, coord);
    let maxDistance = 0;
    neighbors.map((neighbor) => {
        if (visited.has(neighbor.toString())) return;
        maxDistance = Math.max(
            maxDistance,
            dfs(matrix, neighbor, new Set([...visited]), distance + 1),
        );
    });
    return maxDistance;
}

function validNeighbors(matrix: string[][], coord: number[]) {
    const NORTH = [-1, 0];
    const SOUTH = [1, 0];
    const EAST = [0, 1];
    const WEST = [0, -1];
    const VALID_DIRECTIONS: Record<string, number[][]> = {
        "^": [NORTH],
        "v": [SOUTH],
        "<": [WEST],
        ">": [EAST],
        ".": [NORTH, SOUTH, EAST, WEST],
    };
    const char = matrix[coord[0]][coord[1]];
    return VALID_DIRECTIONS[char].flatMap(([dx, dy]) => {
        if (
            coord[0] + dx >= 0 &&
            coord[0] + dx < matrix.length &&
            coord[1] + dy >= 0 &&
            coord[1] + dy < matrix[0].length
        ) {
            const nextCoord = [coord[0] + dx, coord[1] + dy];
            if (Object.keys(VALID_DIRECTIONS).includes(matrix[nextCoord[0]][nextCoord[1]])) {
                return [nextCoord];
            } else {
                return [];
            }
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
