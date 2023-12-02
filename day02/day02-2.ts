import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 2: Cube Conundrum
 * https://adventofcode.com/2023/day/2
 */
const process = (lines: string[]) => {
    const regex = /(\d+) (blue|red|green)(;?)/gm;
    let powersSum = 0;
    lines.forEach((line) => {
        if (line.trim().length === 0) {
            return;
        }
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
        let match;
        while ((match = regex.exec(line)) !== null) {
            cubes[match[2]] += parseInt(match[1]);
            const isFinalMatch = match.index + match[0].length === regex.lastIndex;
            if (match[3] === ";" || isFinalMatch) {
                minimums.red = Math.max(minimums.red, cubes.red);
                minimums.green = Math.max(minimums.green, cubes.green);
                minimums.blue = Math.max(minimums.blue, cubes.blue);
                cubes.red = 0;
                cubes.green = 0;
                cubes.blue = 0;
            }
        }
        powersSum += (minimums.red * minimums.green * minimums.blue);
    });
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
