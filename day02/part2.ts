import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 2: Cube Conundrum (Part 2)
 * https://adventofcode.com/2023/day/2
 */
const process = (lines: string[]) => {
    const regex = /(\d+) (blue|red|green)(;?)/gm;
    const powers = lines.map((line) => {
        const minimums: Record<string, number> = {
            red: 0,
            green: 0,
            blue: 0,
        };
        line.split(": ")[1]
            .split("; ")
            .map((cubesLine) => {
                const cubes: Record<string, number> = {
                    red: 0,
                    green: 0,
                    blue: 0,
                };
                const matches = [...cubesLine.matchAll(regex)];
                matches.forEach((match) => {
                    cubes[match[2]] += parseInt(match[1]);
                });
                minimums.red = Math.max(minimums.red, cubes.red);
                minimums.green = Math.max(minimums.green, cubes.green);
                minimums.blue = Math.max(minimums.blue, cubes.blue);
            });
        return minimums.red * minimums.green * minimums.blue;
    });
    const powersSum = powers.reduce((a, b) => a + b, 0);
    return powersSum;
};

/**
 * Main execution function
 */
const FILENAME = "input.txt";
(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filepath = `${__dirname}/${FILENAME}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
})();
