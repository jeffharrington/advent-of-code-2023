import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 15: Lens Library
 * https://adventofcode.com/2023/day/15
 */
const process = (lines: string[]) => {
    const codes = lines[0].split(",").map((str) => str.split(""));
    const sum = codes.reduce((acc, code) => {
        return acc + hash(code);
    }, 0);
    return sum;
};

export function hash(code: string[]): number {
    return code.reduce((acc, char) => {
        const ascii = char.charCodeAt(0);
        acc += ascii;
        acc *= 17;
        acc %= 256;
        return acc;
    }, 0);
}

/**
 * Main execution function
 */
export function main(filename: string): number {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const filepath = `${currentDirectory}/${filename}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
    return answer;
}

main("input.txt");
