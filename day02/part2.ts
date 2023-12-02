import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 2: Cube Conundrum (Part 2)
 * https://adventofcode.com/2023/day/2
 */
const process = (lines: string[]) => {
    const regex = /(\d+) (blue|red|green)(;?)/gm;
    const powers = lines.map((line) => {
        const cubes: Record<string, number> = {
            red: 0,
            green: 0,
            blue: 0,
        };
        const minimums: Record<string, number> = {
            red: 0,
            green: 0,
            blue: 0,
        };
        const matches = [...line.matchAll(regex)];
        matches.forEach((match, match_index) => {
            cubes[match[2]] += parseInt(match[1]);
            if (match[3] === ";" || match_index === matches.length - 1) {
                minimums.red = Math.max(minimums.red, cubes.red);
                minimums.green = Math.max(minimums.green, cubes.green);
                minimums.blue = Math.max(minimums.blue, cubes.blue);
                cubes.red = 0;
                cubes.green = 0;
                cubes.blue = 0;
            }
        });
        return minimums.red * minimums.green * minimums.blue;
    });
    const powersSum = powers.reduce((a, b) => a + b, 0);
    console.log(powersSum);
};

const FILENAME = "input.txt";

(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filepath = `${__dirname}/${FILENAME}`;
    const fileContent = await readFile(filepath, "utf-8");
    const lines = fileContent.split("\n");
    process(lines);
})();
