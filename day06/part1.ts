import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 6: Wait For It (Part 1)
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
    const wins: number[] = [];
    times.forEach((time, i) => {
        let numWins = 0;
        Array.from({ length: time }).forEach((_, tick) => {
            const travelSpeed = tick;
            const distance = travelSpeed * (time - tick);
            const win = distance > distances[i];
            if (win) {
                numWins += 1;
            }
        });
        wins.push(numWins);
    });
    return wins.reduce((a, b) => a * b, 1);
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
