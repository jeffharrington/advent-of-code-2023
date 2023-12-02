import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 1: Trebuchet?! (Part 1)
 * https://adventofcode.com/2023/day/1
 */
const process = (lines: string[]) => {
    const allNumbers = lines.map((line) => {
        const numbersInLine = Array.from(line).filter((c) => !isNaN(parseInt(c)));
        const firstNumber = numbersInLine[0];
        const lastNumber = numbersInLine[numbersInLine.length - 1];
        return parseInt(firstNumber + lastNumber);
    });
    const sum = allNumbers.reduce((a, b) => a + b, 0);
    return sum;
};

const FILENAME = "input.txt";

(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filepath = `${__dirname}/${FILENAME}`;
    const fileContent = await readFile(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
})();
