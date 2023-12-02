import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 2: Cube Conundrum (Part 1)
 * https://adventofcode.com/2023/day/2
 */
const process = (lines: string[]) => {
    const regex = /(\d+) (blue|red|green)(;?)/gm;
    let gameSum = 0;
    lines.forEach((line, index) => {
        const cubes: Record<string, number> = {
            red: 0,
            green: 0,
            blue: 0,
        };
        let possible = true;
        let match;
        while ((match = regex.exec(line)) !== null) {
            cubes[match[2]] += parseInt(match[1]);
            const isFinalMatch = match.index + match[0].length === regex.lastIndex;
            if (match[3] === ";" || isFinalMatch) {
                if (!(cubes.red <= 12 && cubes.green <= 13 && cubes.blue <= 14)) {
                    possible = false;
                }
                cubes.red = 0;
                cubes.green = 0;
                cubes.blue = 0;
            }
        }
        if (possible) {
            gameSum += index + 1;
        }
    });
    console.log(gameSum);
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
