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
        const [winning_str, card_str] = allNumbersStr.split(" | ");
        const winning_numbers = new Set(
            winning_str.split(" ").flatMap((str) => (str.trim() ? [parseInt(str.trim())] : [])),
        );
        const card_numbers = new Set(
            card_str.split(" ").flatMap((str) => (str.trim() ? [parseInt(str.trim())] : [])),
        );
        const commonNumbers = new Set(
            Array.from(card_numbers).filter((num) => winning_numbers.has(num)),
        );
        const score = commonNumbers.size > 0 ? 2 ** (commonNumbers.size - 1) : 0;
        return score;
    });
    return scores.reduce((a, b) => a + b, 0);
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
