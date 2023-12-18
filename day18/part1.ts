import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 18: Lavaduct Lagoon
 * https://adventofcode.com/2023/day/18
 */
type Cube = {
    row: number;
    col: number;
    color: string;
};

type Instruction = {
    direction: string;
    steps: number;
    color: string;
};

const process = (lines: string[]) => {
    const instructions = getInstructions(lines);
    const trenches: Cube[] = [];
    const firstInstruction = instructions[0];
    trenches.push({ row: 0, col: 0, color: firstInstruction.color });
    let currRow = 0;
    let currCol = 0;
    let totalSteps = 0;
    instructions.forEach((instruction) => {
        console.log(instruction);
        totalSteps += instruction.steps;
        for (let i = 0; i < instruction.steps; i++) {
            switch (instruction.direction) {
                case "R":
                    currCol += 1;
                    break;
                case "L":
                    currCol -= 1;
                    break;
                case "U":
                    currRow -= 1;
                    break;
                case "D":
                    currRow += 1;
                    break;
            }
            // if (currRow < 0 || currCol < 0) {
            //     throw new Error(`Invalid row or col: ${currRow},${currCol}`);
            // }
            trenches.push({ row: currRow, col: currCol, color: instruction.color });
        }
    });

    const minRow = trenches.reduce((min, curr) => (curr.row < min ? curr.row : min), 0);
    const maxRow = trenches.reduce((max, curr) => (curr.row > max ? curr.row : max), 0);
    const minCol = trenches.reduce((min, curr) => (curr.col < min ? curr.col : min), 0);
    const maxCol = trenches.reduce((max, curr) => (curr.col > max ? curr.col : max), 0);

    console.log("Min row", minRow, "(", maxRow, ")");
    console.log("Min col", minCol, "(", maxCol, ")");
    const width = maxCol - minCol + 1;
    const height = maxRow - minRow + 1;
    console.log("Width:", width);
    console.log("Height:", height);
    const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => "."));
    trenches.forEach((cube) => {
        console.log(cube);
        const adjustedRow = cube.row - minRow;
        const adjustedCol = cube.col - minCol;
        grid[adjustedRow][adjustedCol] = "#";
    });
    console.log(grid.map((row) => row.join("")).join("\n"));
    console.log("\n\n");
    const numBoundary = countNumTrenches(grid);
    floodFill(grid);
    console.log(grid.map((row) => row.join("")).join("\n"));
    const numTrenches = countNumTrenches(grid);
    const numInterior = numTrenches - numBoundary;
    console.log("Num boundary:", numBoundary);
    console.log("Total steps:", totalSteps);
    console.log("Num interior:", numInterior);
    const picks = numInterior + numBoundary / 2 - 1;
    console.log("Picks:", picks);
    return numTrenches;
};

function getInstructions(lines: string[]): Instruction[] {
    const regex = /^(.+) (.+) \((.*)\)$/;
    const instructions: Instruction[] = [];
    lines.forEach((line) => {
        console.log(line);
        const matches = regex.exec(line);
        if (!matches) {
            console.error("Invalid line", line, "Matches:", matches);
            return 1;
        }
        console.log("Length:", parseInt(matches[2]));
        instructions.push({
            direction: matches[1],
            steps: parseInt(matches[2]),
            color: matches[3],
        });
    });
    return instructions;
}

function countNumTrenches(grid: string[][]): number {
    let numTrenches = 0;
    grid.forEach((row) => {
        row.forEach((col) => {
            if (col === "#") {
                numTrenches += 1;
            }
        });
    });
    return numTrenches;
}

function floodFill(grid: string[][]) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === "#") {
                continue;
            }
            const boundNorth = isBoundNorth(grid, i, j);
            const boundSouth = isBoundSouth(grid, i, j);
            const boundWest = isBoundWest(grid, i, j);
            const boundEast = isBoundEast(grid, i, j);
            if (boundNorth && boundSouth && boundWest && boundEast) {
                grid[i][j] = "#";
            }
        }
    }
}

function isBoundNorth(grid: string[][], row: number, col: number): boolean {
    while (row >= 0) {
        if (grid[row][col] === "#") {
            return true;
        }
        row -= 1;
    }
    return false;
}

function isBoundSouth(grid: string[][], row: number, col: number) {
    while (row < grid.length) {
        if (grid[row][col] === "#") {
            return true;
        }
        row += 1;
    }
    return false;
}

function isBoundWest(grid: string[][], row: number, col: number) {
    while (col >= 0) {
        if (grid[row][col] === "#") {
            return true;
        }
        col -= 1;
    }
    return false;
}

function isBoundEast(grid: string[][], row: number, col: number) {
    while (col < grid[0].length) {
        if (grid[row][col] === "#") {
            return true;
        }
        col += 1;
    }
    return false;
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

// 73192 -- Too high
// 73191 -- Too high
// 70947 -- Incorrect
// 70949 -- Incorrect

main("input.txt");
