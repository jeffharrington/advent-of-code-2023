import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 22: Sand Slabs
 * https://adventofcode.com/2023/day/22
 */
const process = (lines: string[]) => {
    const squares: Record<string, number[][]> = {};

    const matrix = Array.from({ length: 1000 }, () =>
        Array.from({ length: 1000 }, () => Array.from({ length: 1000 }, () => ".")),
    );

    // Initialize the ground level
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < 1000; j++) {
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

    let squaresMoved = true;
    while (squaresMoved) {
        squaresMoved = false;
        Object.keys(squares)
            .reverse()
            .forEach((key) => {
                // Square can move down if it's empty (or itself) below it
                const canMoveDown = squares[key].every(
                    ([x, y, z]) =>
                        z > 1 && (matrix[x][y][z - 1] === "." || matrix[x][y][z - 1] === key),
                );
                if (canMoveDown) {
                    squaresMoved = true;
                    squares[key].forEach(([x, y, z]) => {
                        matrix[x][y][z] = ".";
                        matrix[x][y][z - 1] = key;
                    });
                    squares[key] = squares[key].map(([x, y, z]) => [x, y, z - 1]);
                }
            });
    }

    const sortedSquares = Object.keys(squares).sort((a, b) => {
        const [x1, y1, z1] = squares[a][0];
        const [x2, y2, z2] = squares[b][0];
        return z2 - z1;
    });

    const supportingMap: Record<string, string[]> = {};
    sortedSquares.forEach((key) => {
        const values = squares[key];
        const blocksBelow = values.map(([x, y, z]) => matrix[x][y][z - 1]);
        const uniqueBlocks = new Set(blocksBelow.filter((block) => block !== "." && block !== key));
        console.log(key, "has below it", uniqueBlocks);
        supportingMap[key] = Array.from(uniqueBlocks);
    });
    console.log("Supporting map:", supportingMap);

    const blocksThatCannotBeDisintegrated = new Set();
    Object.keys(supportingMap).forEach((key) => {
        const values = supportingMap[key];
        if (values.length === 1 && values[0] !== "-") {
            blocksThatCannotBeDisintegrated.add(values[0]);
        }
    });
    console.log(blocksThatCannotBeDisintegrated);

    const numThatCanBeDisintegrated =
        Object.keys(supportingMap).length - blocksThatCannotBeDisintegrated.size;
    return numThatCanBeDisintegrated;
};

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
