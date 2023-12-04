import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 4: Scratchcards (Part 2)
 * https://adventofcode.com/2023/day/4
 */
const process = (lines: string[]) => {
    // const copyCounts: Record<number, number> = {};
    const totalCounts: Record<number, number> = {};
    const scores = lines.map((line, index) => {
        const gameNumber = index + 1;
        totalCounts[gameNumber] = totalCounts[gameNumber] || 0;
        totalCounts[gameNumber] += 1;
        for (let j = 0; j < totalCounts[gameNumber]; j++) {
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
            for (let i = 0; i < numWinners; i++) {
                const nextGameNumber = gameNumber + i + 1;
                totalCounts[nextGameNumber] = totalCounts[nextGameNumber] || 0;
                totalCounts[nextGameNumber] += 1;
            }
            // console.log(totalCounts);
            // console.log("-----------------------------------");
        }
    });
    const totalSum = Object.values(totalCounts).reduce((a, b) => a + b, 0);
    // console.log(totalSum);
    return totalSum;
};

/**
 * Main execution function
 */
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
