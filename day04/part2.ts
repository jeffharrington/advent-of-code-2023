import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 4: Scratchcards (Part 2)
 * https://adventofcode.com/2023/day/4
 */
const process = (lines: string[]) => {
    const totalCounts: Record<string, number> = lines.reduce(
        (counts: Record<string, number>, line, index) => {
            const gameNumber = index + 1;
            counts[gameNumber] = counts[gameNumber] || 0;
            counts[gameNumber] += 1;
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
            const numWinners = commonNumbers.size;
            Array.from({ length: numWinners }).forEach((_, i) => {
                const nextGameNumber = gameNumber + i + 1;
                counts[nextGameNumber] = counts[nextGameNumber] || 0;
                counts[nextGameNumber] += counts[gameNumber];
            });
            return counts;
        },
        {},
    );
    const totalSum = Object.values(totalCounts).reduce((a, b) => a + b, 0);
    return totalSum;
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
