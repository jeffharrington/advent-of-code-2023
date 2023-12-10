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
    if (!startingShape) {
        throw new Error("Starting shape not found");
    }
    matrix[startingPoint[0]][startingPoint[1]] = startingShape as string;
    let zoomedMatrix = Array.from(new Array(matrix.length * 2), () =>
        new Array(matrix[0].length * 2).fill(false),
    );
    let i = startingPoint[0];
    let j = startingPoint[1];
    let visited = new Set<string>([startingPoint.toString()]);
    while (true) {
        zoomedMatrix[i * 2][j * 2] = true;
        const c = matrix[i][j];
        const up = c == "|" || c == "L" || c == "J";
        const down = c == "|" || c == "7" || c == "F";
        const left = c == "-" || c == "7" || c == "J";
        const right = c == "-" || c == "L" || c == "F";
        if (right) {
            zoomedMatrix[i * 2][j * 2 + 1] = true;
            if (!visited.has([i, j + 1].toString())) {
                j++;
                visited = visited.add([i, j].toString());
                continue;
            }
        }
        if (up) {
            zoomedMatrix[i * 2 - 1][j * 2] = true;
            if (!visited.has([i - 1, j].toString())) {
                i--;
                visited = visited.add([i, j].toString());
                continue;
            }
        }
        if (down) {
            zoomedMatrix[i * 2 + 1][j * 2] = true;
            if (!visited.has([i + 1, j].toString())) {
                i++;
                visited = visited.add([i, j].toString());
                continue;
            }
        }
        if (left) {
            if (!visited.has([i, j - 1].toString())) {
                zoomedMatrix[i * 2][j * 2 - 1] = true;
                j--;
                visited = visited.add([i, j].toString());
                continue;
            }
        }
        break;
    }

    const queue = [[0, 0]];
    while (queue.length > 0) {
        const [i, j] = queue.shift()!;
        for (const pt of neighbors([i, j])) {
            const [ii, jj] = pt;
            if (
                ii >= 0 &&
                jj >= 0 &&
                ii < zoomedMatrix.length &&
                jj < zoomedMatrix[0].length &&
                !zoomedMatrix[ii][jj]
            ) {
                zoomedMatrix[ii][jj] = true;
                queue.push([ii, jj]);
            }
        }
    }

    let answer = 0;
    for (let i = 0; i < zoomedMatrix.length; i++) {
        for (let j = 0; j < zoomedMatrix[i].length; j++) {
            if (!zoomedMatrix[i][j] && i % 2 == 0 && j % 2 == 0) {
                answer++;
            }
        }
    }
    return answer;
};

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
    let startingShape = null;
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
