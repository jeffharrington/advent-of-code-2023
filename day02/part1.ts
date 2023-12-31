import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 2: Cube Conundrum (Part 1)
 * https://adventofcode.com/2023/day/2
 */
const process = (lines: string[]) => {
    const regex = /(\d+) (blue|red|green)(;?)/gm;
    const possibleGameIndexes = lines.map((line, index) => {
        const possibilities = line
            .split(": ")[1]
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
                return cubes.red <= 12 && cubes.green <= 13 && cubes.blue <= 14;
            });
        return possibilities.every((possible) => possible) ? index + 1 : 0;
    });
    const possibleGameIndexesSum = possibleGameIndexes.reduce((a, b) => a + b, 0);
    return possibleGameIndexesSum;
};

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
