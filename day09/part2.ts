import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 9: Mirage Maintenance (Part 2)
 * https://adventofcode.com/2023/day/9
 */
const process = (lines: string[]) => {
    const sum = lines.reduce((acc, line) => {
        const history: number[][] = [];
        const readings = line.split(" ").map((reading) => parseInt(reading));
        let currReading = readings;
        while (true) {
            history.push(currReading);
            if (currReading.every((reading) => reading === 0)) break;
            const nextReading = currReading.flatMap((reading, index) => {
                if(index + 1 >= currReading.length) return [];
                return [currReading[index + 1] - reading];
            });
            currReading = nextReading;
        }
        console.log(history);
        const nextSequence = Array.from(history).reverse().reduce((acc, curr) => {
            return acc = curr[0] - acc;
        }, 0);
        console.log("Next:", nextSequence);
        return acc += nextSequence;
    }, 0);
    return sum;
};

/**
 * Main execution function
 */
function main(filename: string): number {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filepath = `${__dirname}/${filename}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
    return answer;
}

main("input.txt");
