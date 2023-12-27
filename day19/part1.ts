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
    let processingInstructions = true;
    const dataRegex = /.\=(\d+),.\=(\d+),.\=(\d+),.\=(\d+)/;
    const dataset: Data[] = [];
    const instructionTree: Record<string, Instruction> = {};
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
            // Check if instruction passed
            let checkPassed = false;
            if (curr.check === "<") {
                checkPassed = target < curr.value;
            } else if (curr.check === ">") {
                checkPassed = target > curr.value;
            }
            if (checkPassed) {
                switch (curr.trueBranch) {
                    case "A":
                        console.log("ACCEPTED!");
                        accepted.push(datum);
                        curr = null;
                        break;
                    case "R":
                        console.log("REJECTED!");
                        curr = null;
                        break;
                    default:
                        if (typeof curr.trueBranch === "string") {
                            console.log("Going to", curr.trueBranch);
                            console.log("---------");
                            curr = instructionTree[curr.trueBranch];
                        } else {
                            console.log("Going deeper...");
                            console.log("---------");
                            curr = curr.trueBranch;
                        }
                        break;
                }
            } else {
                switch (curr.falseBranch) {
                    case "A":
                        console.log("ACCEPTED!");
                        accepted.push(datum);
                        curr = null;
                        break;
                    case "R":
                        console.log("REJECTED!");
                        curr = null;
                        break;
                    default:
                        if (typeof curr.falseBranch === "string") {
                            console.log("Going to", curr.falseBranch);
                            console.log("---------");
                            curr = instructionTree[curr.falseBranch];
                        } else {
                            console.log("Going deeper...");
                            console.log("---------");
                            curr = curr.falseBranch;
                        }
                        break;
                }
            }
        }
    });
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("ACCEPTED");
    console.log(accepted);
    let sum = 0;
    accepted.forEach((datum) => {
        sum += datum.x + datum.m + datum.a + datum.s;
    });
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

// 184699 too low
