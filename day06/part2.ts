import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 6: Wait For It (Part 2)
 * https://adventofcode.com/2023/day/6
 */
const process = (lines: string[]) => {
    const numbersRegex = /(\d+)/gm;
    const times = lines.flatMap((line) => {
        return line.includes("Time:")
            ? [...line.matchAll(numbersRegex)].map((match) => parseInt(match[0]))
            : [];
    });
    const distances = lines.flatMap((line) => {
        return line.includes("Distance:")
            ? [...line.matchAll(numbersRegex)].map((match) => parseInt(match[0]))
            : [];
    });
    const time = parseInt(Array.from(times).reduce((acc, curr) => acc + curr, ""));
    const recordDistance = parseInt(Array.from(distances).reduce((acc, curr) => acc + curr, ""));
    let numWins = 0;
    Array.from({ length: time }).forEach((_, travelSpeed) => {
        const distance = travelSpeed * (time - travelSpeed);
        const win = distance > recordDistance;
        if (win) {
            numWins += 1;
        }
    });
    return numWins;
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
