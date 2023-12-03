import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 3: Gear Ratios
 * https://adventofcode.com/2023/day/3
 */
const process = (lines: string[]) => {
    const height = lines.length;
    const width = lines[0].length;

    const { numberCoordinates, symbolCoordinates } = buildCoordinateMaps(lines);

    const gearRatiosFound: number[] = [];
    Object.keys(symbolCoordinates).forEach((coordinate) => {
        const adjacentNumbers: Set<number> = new Set();
        if (symbolCoordinates[coordinate] !== "*") return; // Skip if not a gear
        const [row, col] = coordinate.split(",").map((value) => parseInt(value));
        const adjacent = getAdjacentCoordinates(row, col, height, width);
        adjacent.forEach((coordinate) => {
            if (numberCoordinates[coordinate.toString()] !== undefined) {
                // Number found at adjacent coordinate
                adjacentNumbers.add(numberCoordinates[coordinate.toString()]);
            }
        });
        if (adjacentNumbers.size === 2) {
            const adjacentNumbersArray = Array.from(adjacentNumbers);
            const gearRatio = adjacentNumbersArray[0] * adjacentNumbersArray[1];
            gearRatiosFound.push(gearRatio);
        }
    });

    const gearRatiosSum = [...gearRatiosFound].reduce((a, b) => a + b, 0);
    return gearRatiosSum;
};

/**
 * Build two maps of coordinates: one for numbers and one for symbols
 */
const buildCoordinateMaps = (lines: string[]) => {
    const regex = /(\d+)|([^\w.])/gm; // RegEx to match any digit or any non-period symbol
    const numberCoordinates: Record<string, number> = {}; // "0, 2" => 456
    const symbolCoordinates: Record<string, string> = {}; // "0, 2" => "+"
    lines.forEach((line, row_index) => {
        const matches = [...line.matchAll(regex)];
        matches.forEach((match) => {
            const match_index = match.index as number;
            if (isNaN(parseInt(match[0]))) {
                // We found a symbol
                const symbolCoordinate = [row_index, match_index].toString();
                symbolCoordinates[symbolCoordinate] = match[0];
            } else {
                // We found a number
                for (let i = 0; i < match[0].length; i++) {
                    const numCoordinate = [row_index, match_index + i].toString();
                    numberCoordinates[numCoordinate] = parseInt(match[0]);
                }
            }
        });
    });
    return { numberCoordinates, symbolCoordinates };
};

/**
 * Return coordinates of adjacent cells for a given cell
 */
const getAdjacentCoordinates = (
    row: number,
    column: number,
    maxHeight: number,
    maxWidth: number,
): number[][] => {
    const coordinates: number[][] = [];
    if (row - 1 >= 0 && column - 1 >= 0) {
        coordinates.push([row - 1, column - 1]);
    }
    if (row - 1 >= 0) {
        coordinates.push([row - 1, column]);
    }
    if (row - 1 >= 0 && column + 1 < maxWidth) {
        coordinates.push([row - 1, column + 1]);
    }
    if (column - 1 >= 0) {
        coordinates.push([row, column - 1]);
    }
    if (column + 1 < maxWidth) {
        coordinates.push([row, column + 1]);
    }
    if (row + 1 < maxHeight && column - 1 >= 0) {
        coordinates.push([row + 1, column - 1]);
    }
    if (row + 1 < maxHeight) {
        coordinates.push([row + 1, column]);
    }
    if (row + 1 < maxHeight && column + 1 < maxWidth) {
        coordinates.push([row + 1, column + 1]);
    }
    return coordinates;
};

/**
 * Main execution function
 */
(async () => {
    const FILENAME = "input.txt";
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filepath = `${__dirname}/${FILENAME}`;
    const fileContent = await readFile(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
})();
