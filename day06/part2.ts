import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 6: Wait For It (Part 1)
 * https://adventofcode.com/2023/day/6
 */
const process = (lines: string[]) => {
    const numbersRegex = /(\d+)/gm;
    let times: string[] = [];
    let distances: string[] = [];
    lines.forEach((line) => {
        if (line.includes("Time:")) {
            times = [...line.matchAll(numbersRegex)].map((match) => match[0]);
        } else if (line.includes("Distance:")) {
            distances = [...line.matchAll(numbersRegex)].map((match) => match[0]);
        }
    });
    const time = parseInt(Array.from(times).reduce((acc, curr) => (acc += curr), ""));
    const recordDistance = parseInt(Array.from(distances).reduce((acc, curr) => (acc += curr), ""));

    // console.log("distance", distances[i], times);
    let numWins = 0;
    const wins: number[] = [];
    Array.from({ length: time }).forEach((_, tick) => {
        const travelSpeed = tick;
        const distance = travelSpeed * (time - tick);
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
