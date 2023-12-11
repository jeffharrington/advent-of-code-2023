import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 11: Cosmic Expansion
 * https://adventofcode.com/2023/day/11
 */
const process = (lines: string[]) => {
    const matrix = lines.map((line) => line.split(""));

    const expandableRows = matrix.flatMap((row, row_index) => {
        if (row.every((col) => col === ".")) {
            return [row_index];
        } else {
            return [];
        }
    });

    const expandableCols = transpose(matrix).flatMap((row, row_index) => {
        if (row.every((col) => col === ".")) {
            return [row_index];
        } else {
            return [];
        }
    });

    const galaxies = matrix.flatMap((row, rowIndex) => {
        return row.flatMap((col, colIndex) => {
            if (col === "#") {
                return [[rowIndex, colIndex]];
            } else {
                return [];
            }
        });
    });

    const distancesSum = galaxies.reduce((acc, galaxy, index) => {
        const remainingGalaxies = galaxies.slice(index + 1);
        const totalDistance = remainingGalaxies.reduce((distanceAcc, otherGalaxy) => {
            const distance = manhattan(galaxy, otherGalaxy);
            const rowExpansion = expandableRows.reduce((rowAcc, row) => {
                if (
                    (galaxy[0] >= row && otherGalaxy[0] <= row) ||
                    (galaxy[0] <= row && otherGalaxy[0] >= row)
                ) {
                    return rowAcc + 1;
                } else {
                    return rowAcc;
                }
            }, 0);
            const colExpansion = expandableCols.reduce((colAcc, col) => {
                if (
                    (galaxy[1] >= col && otherGalaxy[1] <= col) ||
                    (galaxy[1] <= col && otherGalaxy[1] >= col)
                ) {
                    return colAcc + 1;
                } else {
                    return colAcc;
                }
            }, 0);
            return distanceAcc + distance + rowExpansion + colExpansion;
        }, 0);
        return acc + totalDistance;
    }, 0);

    return distancesSum;
};

function manhattan(coord1: number[], coord2: number[]) {
    return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
}

function transpose(matrix: string[][]): string[][] {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
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
