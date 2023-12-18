import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 18: Lavaduct Lagoon
 * https://adventofcode.com/2023/day/18
 */
type Instruction = {
    direction: string;
    steps: number;
    color: string;
};

const process = (lines: string[]) => {
    const instructions = getInstructions(lines);
    const area = getArea(instructions);
    return area;
};

function getInstructions(lines: string[]): Instruction[] {
    const regex = /^(.+) (.+) \((.*)\)$/;
    const instructions: Instruction[] = lines.map((line) => {
        const matches = regex.exec(line);
        if (!matches) throw new Error(`Invalid instruction: ${line}`);
        return {
            direction: matches[1],
            steps: parseInt(matches[2]),
            color: matches[3],
        };
    });
    return instructions;
}

function getArea(instructions: Instruction[]): number {
    let row = 0;
    let col = 0;
    let totalSteps = 0;
    const DIRECTIONS: Record<string, number[]> = { R: [0, 1], L: [0, -1], U: [-1, 0], D: [1, 0] };
    const points = instructions.map((instruction) => {
        const [dRow, dCol] = DIRECTIONS[instruction.direction];
        row += dRow * instruction.steps;
        col += dCol * instruction.steps;
        totalSteps += instruction.steps;
        return [row, col];
    });
    const shoelace = getShoelace(points);
    return shoelace + totalSteps / 2 + 1;
}

function getShoelace(points: number[][]): number {
    let sum = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[i + 1];
        sum += x1 * y2 - x2 * y1;
    }
    return Math.abs(sum) / 2;
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
