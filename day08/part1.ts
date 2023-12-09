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
    const table = lines.reduce((acc: Record<string, string[]>, line) => {
        const match = regex.exec(line);
        if (match) {
            const [, node, left, right] = match;
            acc[node] = [left, right];
        }
        return acc;
    }, {});
    const step = getSteps(table, moves, "AAA", 0);
    return step;
};

function getSteps(table: Record<string, string[]>, moves: string, curr: string, step: number) {
    if (curr === "ZZZ") return step;
    const move = moves[step % moves.length];
    const [left, right] = table[curr];
    const next = move === "L" ? left : right;
    return getSteps(table, moves, next, step + 1);
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
