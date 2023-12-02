import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 2: Cube Conundrum (Part 1)
 * https://adventofcode.com/2023/day/2
 */
const process = (lines: string[]) => {
    const regex = /(\d+) (blue|red|green)(;?)/gm;
    const possibleGameIndexes = lines.map((line, index) => {
        const cubes: Record<string, number> = {
            red: 0,
            green: 0,
            blue: 0,
        };
        const matches = [...line.matchAll(regex)];
        const possibilities = matches.map((match, match_index) => {
            cubes[match[2]] += parseInt(match[1]);
            if (match[3] === ";" || match_index === matches.length - 1) {
                if (!(cubes.red <= 12 && cubes.green <= 13 && cubes.blue <= 14)) {
                    return false; // not possible
                }
                cubes.red = 0;
                cubes.green = 0;
                cubes.blue = 0;
            }
            return true; // possible
        });
        return possibilities.every((possible) => possible) ? index + 1 : 0;
    });
    const possibleGameIndexesSum = possibleGameIndexes.reduce((a, b) => a + b, 0);
    console.log(possibleGameIndexesSum);
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
