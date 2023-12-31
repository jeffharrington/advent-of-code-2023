import { readFileSync } from "fs";
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