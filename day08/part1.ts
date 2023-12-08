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
    let step = 0;
    let curr = "AAA";
    while (true) {
        if (curr === "ZZZ") break;
        const move = moves[step % moves.length];
        const [left, right] = table[curr];
        curr = move === "L" ? left : right;
        step += 1;
    }
    return step;
};

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
