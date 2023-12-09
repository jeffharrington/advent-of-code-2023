import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 9: Mirage Maintenance (Part 2)
 * https://adventofcode.com/2023/day/9
 */
const process = (lines: string[]) => {
    const sum = lines.reduce((acc, line) => {
        const readings = line.split(" ").map((reading) => parseInt(reading));
        const history = getHistory([readings]);
        const nextSequence = Array.from(history)
            .reverse()
            .reduce((acc, curr) => {
                return (acc = curr[0] - acc);
            }, 0);
        return acc + nextSequence;
    }, 0);
    return sum;
};

function getHistory(readings: number[][]) {
    const currReading = readings[readings.length - 1];
    if (currReading.every((reading) => reading === 0)) {
        return readings;
    }
    const nextReading = currReading.flatMap((reading, index) => {
        if (index + 1 >= currReading.length) return [];
        return [currReading[index + 1] - reading];
    });
    return getHistory([...readings, nextReading]);
}

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
