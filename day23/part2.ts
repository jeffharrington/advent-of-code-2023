import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 23: A Long Walk
 * https://adventofcode.com/2023/day/23
 */
const process = (lines: string[]) => {
    const matrix = lines.map((line) => line.split(""));
    const graph = matrixToGraph(matrix);
    const start = [0, 1];
    const end = [matrix.length - 1, matrix[0].length - 2];
    const maxGraphDistance = dfsGraph(graph, start.toString(), end.toString(), new Set(), 0);
    return maxGraphDistance;
};

function matrixToGraph(matrix: string[][]) {
    const graph: Record<string, Record<string, number>> = {};
    const PATH_CHARS = [".", "^", "v", "<", ">"];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (PATH_CHARS.includes(matrix[i][j])) {
                graph[[i, j].toString()] = {};
                const neighbors = validNeighbors(matrix, [i, j]);
                neighbors.forEach((neighbor, index) => {
                    graph[[i, j].toString()][neighbor.toString()] = 1;
                });
            }
        }
    }
    // Collapse graph
    Object.keys(graph).forEach((key) => {
        if (Object.keys(graph[key]).length == 2) {
            const candidate = graph[key];
            let leftKey = Object.keys(candidate)[0];
            let rightKey = Object.keys(candidate)[1];
            if (!Object.keys(graph[leftKey]).includes(key)) {
                leftKey = Object.keys(candidate)[1];
                rightKey = Object.keys(candidate)[0];
            }
            graph[leftKey][rightKey] = graph[leftKey][key] + graph[rightKey][key];
            graph[rightKey][leftKey] = graph[rightKey][key] + graph[leftKey][key];

            delete graph[key];
            delete graph[leftKey][key];
            delete graph[rightKey][key];
        }
    });
    return graph;
}

function dfsGraph(
    graph: Record<string, Record<string, number>>,
    start: string,
    end: string,
    visited: Set<string>,
    distance: number,
) {
    if (visited.has(start)) return distance;
    if (start === end) {
        return distance;
    }
    visited.add(start);
    const neighbors = Object.keys(graph[start]);
    let maxDistance = 0;
    neighbors.map((neighbor) => {
        if (visited.has(neighbor)) return;
        maxDistance = Math.max(
            maxDistance,
            dfsGraph(
                graph,
                neighbor,
                end,
                new Set([...visited]),
                distance + graph[start][neighbor],
            ),
        );
    });
    return maxDistance;
}

function validNeighbors(matrix: string[][], coord: number[]) {
    const NORTH = [-1, 0];
    const WEST = [0, -1];
    const SOUTH = [1, 0];
    const EAST = [0, 1];
    const PATH_CHARS = [".", "^", "v", "<", ">"];
    return [NORTH, WEST, SOUTH, EAST].flatMap(([dx, dy]) => {
        if (
            coord[0] + dx >= 0 &&
            coord[0] + dx < matrix.length &&
            coord[1] + dy >= 0 &&
            coord[1] + dy < matrix[0].length
        ) {
            const nextCoord = [coord[0] + dx, coord[1] + dy];
            if (PATH_CHARS.includes(matrix[nextCoord[0]][nextCoord[1]])) {
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
