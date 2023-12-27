import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 19: Aplenty
 * https://adventofcode.com/2023/day/19
 */
type Data = {
    x: number;
    m: number;
    a: number;
    s: number;
    [key: string]: number; // Index signature
};

type Instruction = {
    target: string;
    check: string;
    value: number;
    trueBranch: string | Instruction;
    falseBranch: string | Instruction;
};

function processInstruction(line: string): string | Instruction {
    const instructionRegex = /^([xmas])([<>])(\d+):(\w*),(.*)$/;
    const matches = instructionRegex.exec(line);
    if (matches) {
        const [_, target, check, value, truthy, falsy] = matches;
        return {
            target,
            check,
            value: parseInt(value),
            trueBranch: processInstruction(truthy),
            falseBranch: processInstruction(falsy),
        };
    } else {
        return line;
    }
}

const process = (lines: string[]) => {
    const dataRegex = /.\=(\d+),.\=(\d+),.\=(\d+),.\=(\d+)/;
    const dataset: Data[] = [];
    const instructionTree: Record<string, Instruction> = {};

    let processingInstructions = true;
    lines.forEach((line) => {
        if (line.trim() === "") processingInstructions = false;
        if (processingInstructions) {
            const [key, tail] = line.split("{");
            const [instructionLine, _] = tail.split("}");
            instructionTree[key] = processInstruction(instructionLine) as Instruction;
        } else {
            const matches = dataRegex.exec(line);
            if (matches) {
                const [_, x, m, a, s] = matches;
                dataset.push({ x: parseInt(x), m: parseInt(m), a: parseInt(a), s: parseInt(s) });
            }
        }
    });

    const accepted: Data[] = [];

    dataset.forEach((datum) => {
        let curr: Instruction | null = instructionTree["in"];
        while (curr) {
            const target: number = datum[curr.target];
            let checkPassed = false;
            if (curr.check === "<") {
                checkPassed = target < curr.value;
            } else if (curr.check === ">") {
                checkPassed = target > curr.value;
            }
            const nextBranch: string | Instruction = checkPassed
                ? curr.trueBranch
                : curr.falseBranch;
            switch (nextBranch) {
                case "A":
                    accepted.push(datum);
                    curr = null;
                    break;
                case "R":
                    curr = null;
                    break;
                default:
                    if (typeof nextBranch === "string") {
                        curr = instructionTree[nextBranch];
                    } else {
                        curr = nextBranch;
                    }
                    break;
            }
        }
    });

    const sum = accepted.reduce((acc, curr) => {
        return acc + curr.x + curr.m + curr.a + curr.s;
    }, 0);

    return sum;
};

/**
 * Main execution function
 */
export function main(filename: string): number {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const filepath = `${currentDirectory}/${filename}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const startTime = new Date().getTime();
    const answer = process(lines);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(answer);
    console.log("Finished in", elapsedTime, "ms");
    return answer;
}

main("input.txt");
