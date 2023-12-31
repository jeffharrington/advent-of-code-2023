import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 8: Haunted Wasteland (Part 2)
 * https://adventofcode.com/2023/day/8
 */
const process = (lines: string[]) => {
    const moves = lines.shift() || "";
    lines.shift(); // Skip blank line
    const regex = /^(\w+) = \((\w+), (\w+)\)$/;
    const startingNodes: string[] = [];
    const table = lines.reduce((acc: Record<string, string[]>, line) => {
        const match = regex.exec(line);
        if (match) {
            const [, node, left, right] = match;
            acc[node] = [left, right];
            if (node[2] === "A") {
                startingNodes.push(node);
            }
        }
        return acc;
    }, {});
    let step = 0;
    let currNodes = Array.from(startingNodes);
    const stepsTable: Record<string, number> = {};
    while (true) {
        const move = moves[step % moves.length];
        currNodes = currNodes.map((node) => {
            if (node[2] === "Z") {
                stepsTable[node] = step;
            }
            const [left, right] = table[node];
            const next = move === "L" ? left : right;
            return next;
        });
        if (Object.keys(stepsTable).length === startingNodes.length) {
            break;
        }
        step += 1;
    }
    const totalSteps = findLCM(Object.values(stepsTable));
    return totalSteps;
};

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

function findLCM(numbers: number[]): number {
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        result = lcm(result, numbers[i]);
    }
    return result;
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
