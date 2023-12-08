import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 8: Haunted Wasteland (Part 1)
 * https://adventofcode.com/2023/day/8
 */
const process = (lines: string[]) => {
    const moves = lines.shift() || "";
    lines.shift(); // Skip blank line
    const regex = /^(\w+) = \((\w+), (\w+)\)$/;
    const table: Record<string, string[]> = {};
    const startingNodes: string[] = [];
    lines.forEach((line) => {
        // console.log(line);
        const match = regex.exec(line);
        if (match) {
            const [, node, left, right] = match;
            // console.log(node, left, right);
            table[node] = [left, right];
            if (node[2] === "A") {
                startingNodes.push(node);
            }
        }
    });

    console.log(startingNodes);
    // console.log(table);
    let i = 0;
    let num_steps = 0;
    let currNodes = Array.from(startingNodes);
    console.log("Starting nodes:", currNodes);
    const stepsTable: Record<string, number> = {};
    while (true) {
        // if (currNodes.every((node) => node[2] === "Z")) {
        //     break;
        // }
        const move = moves[i];
        currNodes = currNodes.map((node) => {
            if (node[2] === "Z") {
                stepsTable[node] = num_steps;
            }
            const [left, right] = table[node];
            const next = move === "L" ? left : right;
            console.log("move", node, move, "to", next);
            return next;
        });
        if (Object.keys(stepsTable).length === startingNodes.length) {
            break;
        }
        i += 1;
        i %= moves.length;
        num_steps += 1;
    }
    console.log(stepsTable);
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
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filepath = `${__dirname}/${filename}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
    return answer;
}

main("input.txt");
