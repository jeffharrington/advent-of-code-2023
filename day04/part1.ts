import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 4: Scratchcards (Part 1)
 * https://adventofcode.com/2023/day/4
 */
const process = (lines: string[]) => {
    const scores = lines.map((line) => {
        const [_, allNumbersStr] = line.split(": ");
        const [winningStr, cardStr] = allNumbersStr.split(" | ");
        const winningNumbers = new Set(
            winningStr.split(" ").flatMap((str) => (str.trim() ? [parseInt(str.trim())] : [])),
        );
        const cardNumbers = new Set(
            cardStr.split(" ").flatMap((str) => (str.trim() ? [parseInt(str.trim())] : [])),
        );
        const commonNumbers = new Set(
            Array.from(cardNumbers).filter((num) => winningNumbers.has(num)),
        );
        const score = commonNumbers.size > 0 ? 2 ** (commonNumbers.size - 1) : 0;
        return score;
    });
    return scores.reduce((a, b) => a + b, 0);
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