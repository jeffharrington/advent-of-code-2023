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

    const startingShape = getStartingShape(startingPoint, matrix);
    matrix[startingPoint[0]][startingPoint[1]] = startingShape as string;

    const zoomedMatrix = Array.from({ length: matrix.length * 2 }, () =>
        new Array(matrix[0].length * 2).fill(false),
    );

    const filledMatrix = visit(startingPoint, matrix, zoomedMatrix, new Set<string>([]));

    const queue = [[0, 0]];
    while (queue.length > 0) {
        const [i, j] = queue.shift()!;
        for (const pt of neighbors([i, j])) {
            const [ii, jj] = pt;
            if (
                ii >= 0 &&
                jj >= 0 &&
                ii < filledMatrix.length &&
                jj < filledMatrix[0].length &&
                !filledMatrix[ii][jj]
            ) {
                filledMatrix[ii][jj] = true;
                queue.push([ii, jj]);
            }
        }
    }

    const answer = filledMatrix.reduce((acc, row, row_index) => {
        const rowSum = row.reduce((acc2, cell, col_index) => {
            if (!cell && row_index % 2 == 0 && col_index % 2 == 0) {
                return acc2 + 1;
            } else {
                return acc2;
            }
        }, 0);
        return acc + rowSum;
    }, 0);

    return answer;
};

function visit(
    coord: number[],
    matrix: string[][],
    zoomedMatrix: boolean[][],
    visited: Set<string>,
): boolean[][] {
    const shape = matrix[coord[0]][coord[1]];
    visited.add(coord.toString());
    zoomedMatrix[coord[0] * 2][coord[1] * 2] = true;
    const north = shape == "|" || shape == "L" || shape == "J";
    const south = shape == "|" || shape == "7" || shape == "F";
    const west = shape == "-" || shape == "7" || shape == "J";
    const east = shape == "-" || shape == "L" || shape == "F";
    if (east) {
        zoomedMatrix[coord[0] * 2][coord[1] * 2 + 1] = true;
        if (!visited.has([coord[0], coord[1] + 1].toString())) {
            zoomedMatrix = visit([coord[0], coord[1] + 1], matrix, zoomedMatrix, visited);
        }
    }
    if (north) {
        zoomedMatrix[coord[0] * 2 - 1][coord[1] * 2] = true;
        if (!visited.has([coord[0] - 1, coord[1]].toString())) {
            zoomedMatrix = visit([coord[0] - 1, coord[1]], matrix, zoomedMatrix, visited);
        }
    }
    if (south) {
        zoomedMatrix[coord[0] * 2 + 1][coord[1] * 2] = true;
        if (!visited.has([coord[0] + 1, coord[1]].toString())) {
            zoomedMatrix = visit([coord[0] + 1, coord[1]], matrix, zoomedMatrix, visited);
        }
    }
    if (west) {
        zoomedMatrix[coord[0] * 2][coord[1] * 2 - 1] = true;
        if (!visited.has([coord[0], coord[1] - 1].toString())) {
            zoomedMatrix = visit([coord[0], coord[1] - 1], matrix, zoomedMatrix, visited);
        }
    }
    return zoomedMatrix;
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

function getStartingShape(startingPoint: number[], matrix: string[][]) {
    const startingNodes = getNodes(startingPoint, matrix);
    const dx1 = startingNodes[0][0] - startingPoint[0];
    const dy1 = startingNodes[0][1] - startingPoint[1];
    const dx2 = startingNodes[1][0] - startingPoint[0];
    const dy2 = startingNodes[1][1] - startingPoint[1];
    let startingShape = "S";
    if (dx1 > 0 && dy1 === 0) {
        if (dx2 === 0 && dy2 > 0) {
            startingShape = "F";
        } else if (dx2 === 0 && dy2 < 0) {
            startingShape = "7";
        } else if (dx2 < 0 && dy2 === 0) {
            startingShape = "|";
        }
    } else if (dx1 < 0 && dy1 === 0) {
        if (dx2 === 0 && dy2 > 0) {
            startingShape = "L";
        } else if (dx2 === 0 && dy2 < 0) {
            startingShape = "J";
        } else if (dx2 > 0 && dy2 === 0) {
            startingShape = "|";
        }
    } else if (dx1 === 0 && dy1 > 0) {
        if (dx2 === 0 && dy2 < 0) {
            startingShape = "-";
        } else if (dx2 > 0 && dy2 === 0) {
            startingShape = "F";
        } else if (dx2 < 0 && dy2 === 0) {
            startingShape = "L";
        }
    } else if (dx1 === 0 && dy1 < 0) {
        if (dx2 === 0 && dy2 > 0) {
            startingShape = "-";
        } else if (dx2 > 0 && dy2 === 0) {
            startingShape = "7";
        } else if (dx2 < 0 && dy2 === 0) {
            startingShape = "J";
        }
    }
    return startingShape;
}

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
