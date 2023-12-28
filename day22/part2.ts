import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 22: Sand Slabs
 * https://adventofcode.com/2023/day/22
 */
const process = (lines: string[]) => {
    const squares: Record<string, number[][]> = {};

    console.log("Creating matrix...");
    const matrixBound = 310;
    const matrix = Array.from({ length: matrixBound }, () =>
        Array.from({ length: matrixBound }, () => Array.from({ length: matrixBound }, () => ".")),
    );

    // Initialize the ground level
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            matrix[i][j][0] = "-";
        }
    }

    lines.forEach((line, index) => {
        const [coord1, coord2] = line.split("~");
        const [x1, y1, z1] = coord1.split(",").map((n) => parseInt(n));
        const [x2, y2, z2] = coord2.split(",").map((n) => parseInt(n));
        let points = [];
        for (let i = x1; i <= x2; i++) {
            for (let j = y1; j <= y2; j++) {
                for (let k = z1; k <= z2; k++) {
                    points.push([i, j, k]);
                    matrix[i][j][k] = index.toString();
                }
            }
        }
        squares[index.toString()] = points;
    });

    console.log("Falling bricks for the first time...");
    fallBricks(squares, matrix);

    const sortedSquares = Object.keys(squares).sort((a, b) => {
        const [x1, y1, z1] = squares[a][0];
        const [x2, y2, z2] = squares[b][0];
        return z2 - z1;
    });
    console.log("Sorted squares", sortedSquares);

    const supportingMap: Record<string, string[]> = {};
    sortedSquares.forEach((key) => {
        const values = squares[key];
        const blocksBelow = values.map(([x, y, z]) => matrix[x][y][z - 1]);
        const uniqueBlocks = new Set(blocksBelow.filter((block) => block !== "." && block !== key));
        supportingMap[key] = Array.from(uniqueBlocks);
    });
    console.log("Supporting map", supportingMap);

    const blocksThatCannotBeDisintegrated = new Set<string>();
    Object.keys(supportingMap).forEach((key) => {
        const values = supportingMap[key];
        if (values.length === 1 && values[0] !== "-") {
            blocksThatCannotBeDisintegrated.add(values[0]);
        }
    });
    console.log("Blocks that cannot be disintegrated", blocksThatCannotBeDisintegrated);

    let sumFell = 0;
    blocksThatCannotBeDisintegrated.forEach((key, index) => {
        console.log("Cloning squares and matrix... (", index, ")", key);
        const squaresCopy = { ...squares };
        const matrixCopy = matrix.map((level2) => level2.map((row) => [...row]));
        console.log("Cloned!");
        squaresCopy[key].forEach(([x, y, z]) => {
            matrixCopy[x][y][z] = ".";
        });
        console.log("Disintegrated", key);
        delete squaresCopy[key];
        const numFell = fallBricks(squaresCopy, matrixCopy);
        sumFell += numFell;
        console.log("Disintegrated", key, "and", numFell, "fell");
    });

    return sumFell;
};

function fallBricks(squares: Record<string, number[][]>, matrix: string[][][]) {
    let squareFell = true;
    let fallenSquares = new Set<string>();
    while (squareFell) {
        squareFell = false;
        Object.keys(squares)
            .reverse()
            .forEach((key) => {
                // Square can move down if it's empty (or itself) below it
                const canMoveDown = squares[key].every(
                    ([x, y, z]) =>
                        z > 1 && (matrix[x][y][z - 1] === "." || matrix[x][y][z - 1] === key),
                );
                if (canMoveDown) {
                    squareFell = true;
                    fallenSquares.add(key);
                    squares[key].forEach(([x, y, z]) => {
                        matrix[x][y][z] = ".";
                        matrix[x][y][z - 1] = key;
                    });
                    squares[key] = squares[key].map(([x, y, z]) => [x, y, z - 1]);
                }
            });
    }
    return fallenSquares.size;
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
