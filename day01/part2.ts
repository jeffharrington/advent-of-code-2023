import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 1: Trebuchet?! (Part 2)
 * https://adventofcode.com/2023/day/1
 */
const process = (lines: string[]) => {
    const NUMBER_MAP: Record<string, string> = {
        one: "1",
        two: "2",
        three: "3",
        four: "4",
        five: "5",
        six: "6",
        seven: "7",
        eight: "8",
        nine: "9",
    };
    const regex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/gm;
    const lineNumbers = lines.map((line) => {
        const matches = [...line.matchAll(regex)];
        const numbers = matches.map((match) => {
            if (!isNaN(parseInt(match[1]))) {
                return match[1];
            } else {
                return NUMBER_MAP[match[1]];
            }
        });
        const firstNumber = numbers[0];
        const lastNumber = numbers[numbers.length - 1];
        return parseInt(firstNumber + lastNumber);
    });
    const sum = lineNumbers.reduce((a, b) => a + b, 0);
    return sum;
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
