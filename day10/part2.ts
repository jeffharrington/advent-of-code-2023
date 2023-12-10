import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 10: Pipe Maze
 * https://adventofcode.com/2023/day/10
 */
const process = (lines: string[]) => {
    const originalMatrix: string[][] = lines.map((line) => line.split(""));
    const startingPoint = originalMatrix.flatMap((row, row_index) => {
        const colIndex = row.indexOf("S");
        if (colIndex !== -1) {
            return [row_index, colIndex];
        } else {
            return [];
        }
    });
    originalMatrix[startingPoint[0]][startingPoint[1]] = "7";
    let loop = Array.from(new Array(originalMatrix.length * 2), () =>
        new Array(originalMatrix[0].length * 2).fill(false),
    );
    let i = startingPoint[0];
    let j = startingPoint[1];
    // console.log("Starting at", i, j);
    let visited = new Set<string>([[i, j].toString()]);
    while (true) {
        // console.log(visited);
        loop[i * 2][j * 2] = true;
        const c = originalMatrix[i][j];
        const up = c == "|" || c == "L" || c == "J";
        const down = c == "|" || c == "7" || c == "F";
        const left = c == "-" || c == "7" || c == "J";
        const right = c == "-" || c == "L" || c == "F";
        if (right) {
            loop[i * 2][j * 2 + 1] = true;
            if (!visited.has([i, j + 1].toString())) {
                j++;
                visited = visited.add([i, j].toString());
                continue;
            }
        }
        if (up) {
            loop[i * 2 - 1][j * 2] = true;
            if (!visited.has([i - 1, j].toString())) {
                i--;
                visited = visited.add([i, j].toString());
                continue;
            }
        }
        if (down) {
            loop[i * 2 + 1][j * 2] = true;
            if (!visited.has([i + 1, j].toString())) {
                i++;
                visited = visited.add([i, j].toString());
                continue;
            }
        }
        if (left) {
            if (!visited.has([i, j - 1].toString())) {
                loop[i * 2][j * 2 - 1] = true;
                j--;
                visited = visited.add([i, j].toString());
                continue;
            }
        }
        break;
    }

    // console.log(visited);

    // for (const line of loop) {
    //     console.log(line.map((x) => (x ? "X" : " ")).join(""));
    // }

    const queue = [[0, 0]];

    while (queue.length > 0) {
        const [i, j] = queue.shift()!;
        for (const pt of neighbors([i, j])) {
            const [ii, jj] = pt;
            if (ii >= 0 && jj >= 0 && ii < loop.length && jj < loop[0].length && !loop[ii][jj]) {
                loop[ii][jj] = true;
                queue.push([ii, jj]);
            }
        }
    }

    let ans = 0;

    for (let i = 0; i < loop.length; i++) {
        for (let j = 0; j < loop[i].length; j++) {
            if (!loop[i][j] && i % 2 == 0 && j % 2 == 0) {
                ans++;
            }
        }
    }

    console.log(ans);

    return ans;
    // const startingNodes = getNodes(startingPoint, originalMatrix);
    // const dx1 = startingNodes[0][0] - startingPoint[0];
    // const dy1 =  startingNodes[0][1] - startingPoint[1];
    // const dx2 = startingNodes[1][0] - startingPoint[0];
    // const dy2 =  startingNodes[1][1] - startingPoint[1];
    // let startingShape = null;
    // if(dx1 > 0 && dy1 === 0) {
    //     // South
    //     if(dx2 === 0 && dy2 > 0) {
    //         // South + East
    //         startingShape = "F";
    //     } else if(dx2 === 0 && dy2 < 0) {
    //         // South + West
    //         startingShape = "7";
    //     } else if(dx2 < 0 && dy2 === 0) {
    //         // South + North
    //         startingShape = "|";
    //     }
    // } else if(dx1 < 0 && dy1 === 0) {
    //     // North
    //     if(dx2 === 0 && dy2 > 0) {
    //         // North + East
    //         startingShape = "L";
    //     } else if(dx2 === 0 && dy2 < 0) {
    //         // North + West
    //         startingShape = "J";
    //     } else if(dx2 > 0 && dy2 === 0) {
    //         // North + South
    //         startingShape = "|";
    //     }
    // } else if(dx1 === 0 && dy1 > 0) {
    //     // East
    //     if(dx2 === 0 && dy2 < 0) {
    //         // East + West
    //         startingShape = "-";
    //     } else if(dx2 > 0 && dy2 === 0) {
    //         // East + South
    //         startingShape = "F";
    //     } else if(dx2 < 0 && dy2 === 0) {
    //         // East + North
    //         startingShape = "L";
    //     }
    // } else if(dx1 === 0 && dy1 < 0) {
    //     // West
    //     if(dx2 === 0 && dy2 > 0) {
    //         // West + East
    //         startingShape = "-";
    //     } else if(dx2 > 0 && dy2 === 0) {
    //         // West + South
    //         startingShape = "7";
    //     } else if(dx2 < 0 && dy2 === 0) {
    //         // West + North
    //         startingShape = "J";
    //     }
    // }
    // originalMatrix[startingPoint[0]][startingPoint[1]] = startingShape || "S";
    // console.log("Starting shape:", startingShape);
    // originalMatrix.forEach((row) => console.log(row.join("")));
    // const zoomedMatrix = zoomMatrix(originalMatrix);

    // console.log("\n\n");
    // zoomedMatrix.forEach((row) => console.log(row.join("")));
    // console.log("\n\n");
    // const zoomedStartingPoint = [startingPoint[0] * 2, startingPoint[1] * 2];
    // const nodes = getNodes(zoomedStartingPoint, zoomedMatrix);
    // console.log("Nodes:", nodes);
    // const leftDistances = visit(nodes[0], zoomedMatrix, { [startingPoint.toString()]: 0 }, 1);
    // const rightDistances = visit(nodes[1], zoomedMatrix, { [startingPoint.toString()]: 0 }, 1);
    // const bestDistances = Object.keys(leftDistances).reduce((acc: Record<string, number>, key) => {
    //     acc[key] = Math.min(leftDistances[key], rightDistances[key]);
    //     return acc;
    // }, {});
    // for (let i = 0; i < zoomedMatrix.length; i++) {
    //     for (let j = 0; j < zoomedMatrix[0].length; j++) {
    //         const coord = [i, j];
    //         if (bestDistances[coord.toString()] !== undefined) continue;
    //         const isBoundedCell = isBounded(coord, zoomedMatrix, bestDistances);
    //         if (!isBoundedCell) {
    //             zoomedMatrix[i][j] = "0";
    //             fillUnboundedNorth([i, j], zoomedMatrix, bestDistances);
    //             fillUnboundedEast([i, j], zoomedMatrix, bestDistances);
    //             fillUnboundedSouth([i, j], zoomedMatrix, bestDistances);
    //             fillUnboundedWest([i, j], zoomedMatrix, bestDistances);
    //         } else {
    //             zoomedMatrix[i][j] = "I";
    //         }
    //     }
    // }
    // const numberTiles = zoomedMatrix.reduce((acc, row) => {
    //     return (
    //         acc +
    //         row.reduce((innerAcc, cell) => {
    //             return cell === "I" ? innerAcc + 1 : innerAcc;
    //         }, 0)
    //     );
    // }, 0);
    // originalMatrix.forEach((row) => console.log(row.join("")));
    // console.log("\n\n");
    // zoomedMatrix.forEach((row) => console.log(row.join("")));
    // console.log(originalMatrix.length, "x", originalMatrix[0].length);
    // console.log(zoomedMatrix.length, "x", zoomedMatrix[0].length);
    // console.log("Tiles:", numberTiles);
    // return Math.max(...Object.values(bestDistances));
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
function zoomMatrix(matrix: string[][]) {
    const newMatrix = matrix.flatMap((row, rowIndex) => {
        const newRow = row.flatMap((cell, colIndex) => {
            switch (cell) {
                case "L":
                    return ["L", "-"];
                case "J":
                    return ["J", "."];
                case "7":
                    return ["7", "."];
                case "F":
                    return ["F", "-"];
                case "-":
                    return ["-", "-"];
                case "|":
                    return ["|", "."];
                case ".":
                    return [".", "."];
                default:
                    return ["?", "?"];
            }
        });
        const fillerRow = row.flatMap((cell) => {
            switch (cell) {
                case "S":
                    return ["S", "S"];
                case "L":
                    return [".", "."];
                case "J":
                    return [".", "."];
                case "7":
                    return ["|", "."];
                case "F":
                    return ["|", "."];
                case "-":
                    return [".", "."];
                case "|":
                    return ["|", "."];
                case ".":
                    return [".", "."];
                default:
                    return ["?", "?"];
            }
        });
        return [newRow, fillerRow];
    });
    return newMatrix;
}

function fillUnboundedEast(coord: number[], matrix: string[][], distances: Record<string, number>) {
    if (matrix[coord[0]][coord[1]] !== "0") {
        console.log("OOOPS!");
    }
    // Check East bound
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

function fillUnboundedNorth(
    coord: number[],
    matrix: string[][],
    distances: Record<string, number>,
) {
    if (matrix[coord[0]][coord[1]] !== "0") {
        console.log("OOOPS!");
    }
    // Check North bound
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

function fillUnboundedSouth(
    coord: number[],
    matrix: string[][],
    distances: Record<string, number>,
) {
    if (matrix[coord[0]][coord[1]] !== "0") {
        console.log("OOOPS!");
    }
    // Check South bound
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
    if (matrix[coord[0]][coord[1]] !== "0") {
        console.log("OOOPS!");
    }
    // Check West bound
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
    console.log("Getting nodes for", coord.toString());
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
    for (let i = coord[0]; i >= 0; i--) {
        const nextCoordKey = [i, coord[1]].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            console.log("Bounded to the North at", nextCoordKey);
            boundNorth = true;
            break;
        } else if (matrix[i][coord[1]] === "0") {
            boundNorth = false;
            break;
        }
    }
    // Check South bound
    let boundSouth = false;
    for (let i = coord[0]; i < matrix.length; i++) {
        const nextCoordKey = [i, coord[1]].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            console.log("Bounded to the South at", nextCoordKey);
            boundSouth = true;
            break;
        } else if (matrix[i][coord[1]] === "0") {
            boundSouth = false;
            break;
        }
    }
    // Check East bound
    let boundEast = false;
    for (let i = coord[1]; i < matrix[0].length; i++) {
        const nextCoordKey = [coord[0], i].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            console.log("Bounded to the East at", nextCoordKey);
            boundEast = true;
            break;
        } else if (matrix[coord[0]][i] === "0") {
            boundEast = false;
            break;
        }
    }
    // Check West bound
    let boundWest = false;
    for (let i = coord[1]; i >= 0; i--) {
        const nextCoordKey = [coord[0], i].toString();
        const isWall = distances[nextCoordKey] !== undefined;
        if (isWall) {
            console.log("Bounded to the West at", nextCoordKey);
            boundWest = true;
            break;
        } else if (matrix[coord[0]][i] === "0") {
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

main("input.txt");
