import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 11: Cosmic Expansion
 * https://adventofcode.com/2023/day/11
 */
const process = (lines: string[]) => {
    lines.forEach((line) => console.log(line));
    const matrix = lines.map((line) => line.split(""));

    let expandableRows: number[] = [];
    matrix.forEach((row, row_index) => {
        if (row.every((col) => col === ".")) {
            expandableRows.push(row_index);
        }
    });

    const transposedMatrix = transpose(matrix);
    let expandableCols: number[] = [];
    transposedMatrix.forEach((row, row_index) => {
        if (row.every((col) => col === ".")) {
            expandableCols.push(row_index);
        }
    });

    let galaxies: number[][] = [];
    matrix.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col === "#") {
                galaxies.push([rowIndex, colIndex]);
            }
        });
    });

    let sum = 0;
    const distances: Record<string, Record<string, number>> = {};
    for(let i = 0; i < galaxies.length; i++) {
        for(let j = i + 1; j < galaxies.length; j++) {
            const galaxy1 = galaxies[i];
            const galaxy2 = galaxies[j];
            let distance = manhattan(galaxy1, galaxy2);
            expandableRows.forEach((row) => {
                if (
                    (galaxy1[0] >= row && galaxy2[0] <= row) ||
                    (galaxy1[0] <= row && galaxy2[0] >= row)
                ) {
                    // console.log("row", row, "is included");
                    distance += 1000000;
                }
            });
            expandableCols.forEach((col) => {
                if (
                    (galaxy1[1] >= col && galaxy2[1] <= col) ||
                    (galaxy1[1] <= col && galaxy2[1] >= col)
                ) {
                    // console.log("col", col, "is included");
                    distance += 1000000;
                }
            });
            distances[galaxy1.toString()] = distances[galaxy1.toString()] || {};
            distances[galaxy1.toString()][galaxy2.toString()] = distance;
            sum += distance;
        }
    }

    return sum;
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
