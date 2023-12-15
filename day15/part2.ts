import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 15: Lens Library
 * https://adventofcode.com/2023/day/15
 */
const process = (lines: string[]) => {
    const codes = lines[0].split(",");
    const boxes = Array.from({ length: 256 }, (_, i) => new Array<string>());
    const regex = /(\w+)(\W)(\d*)/g;
    const focalLengths: Record<string, number> = {};

    codes.forEach((code) => {
        const matches = [...code.matchAll(regex)];
        const [_, label, operation, focalLength] = matches[0];
        const hashValue = hash(label);
        if (operation == "=") {
            if (boxes[hashValue].includes(label)) {
                const lensIndex = boxes[hashValue].indexOf(label);
                boxes[hashValue][lensIndex] = label;
            } else {
                boxes[hashValue].push(label);
            }
            focalLengths[label] = parseInt(focalLength);
        } else if (operation == "-") {
            if (boxes[hashValue].includes(label)) {
                const labelIndex = boxes[hashValue].indexOf(label);
                boxes[hashValue].splice(labelIndex, 1);
            }
        }
    });

    const answer = boxes.reduce((acc, box, boxIndex) => {
        if (box.length == 0) return acc;
        return (
            acc +
            box.reduce((acc2, lens, slotIndex) => {
                const boxCalc = (boxIndex + 1) * (slotIndex + 1) * focalLengths[lens];
                return acc2 + boxCalc;
            }, 0)
        );
    }, 0);
    return answer;
};

export function hash(code: string): number {
    return code.split("").reduce((acc, char) => {
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
