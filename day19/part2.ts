import { cloneDeep } from "lodash";
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
    target: string; // "x", "m", "a", "s"
    check: string; // "<", ">"
    value: number; // Value to check against
    trueBranch: string | Instruction;
    falseBranch: string | Instruction;
};

type InstructionRange = {
    instruction: string | Instruction;
    ranges: Record<string, number[]>;
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

    const queue: InstructionRange[] = [];
    queue.push({
        instruction: instructionTree["in"],
        ranges: { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] },
    });

    let rangeSum = 0;
    while (queue.length > 0) {
        const curr = queue.shift();
        if (curr === undefined) break;
        const instruction = curr.instruction;
        if (instruction === "A") {
            const xValue = curr.ranges["x"][1] - curr.ranges["x"][0] + 1;
            const mValue = curr.ranges["m"][1] - curr.ranges["m"][0] + 1;
            const aValue = curr.ranges["a"][1] - curr.ranges["a"][0] + 1;
            const sValue = curr.ranges["s"][1] - curr.ranges["s"][0] + 1;
            const possibilities = xValue * mValue * aValue * sValue;
            rangeSum += possibilities;
        } else if (instruction === "R") {
            continue;
        } else if (typeof instruction === "string") {
            const next = instructionTree[instruction];
            queue.push({ instruction: next, ranges: curr.ranges });
            continue;
        } else if (instruction.check === "<") {
            // Push true branch
            const trueRange = cloneDeep(curr.ranges);
            trueRange[instruction.target][1] = Math.min(
                instruction.value - 1,
                trueRange[instruction.target][1],
            );
            queue.push({ instruction: instruction.trueBranch, ranges: trueRange });
            // Push false branch
            const falseRange = cloneDeep(curr.ranges);
            falseRange[instruction.target][0] = Math.max(
                instruction.value,
                falseRange[instruction.target][0],
            );
            queue.push({ instruction: instruction.falseBranch, ranges: falseRange });
            // Push false branch
        } else if (instruction.check === ">") {
            // Push true branch
            const trueRange = cloneDeep(curr.ranges);
            trueRange[instruction.target][0] = Math.max(
                instruction.value + 1,
                trueRange[instruction.target][0],
            );
            queue.push({ instruction: instruction.trueBranch, ranges: trueRange });
            // Push false branch
            const falseRange = cloneDeep(curr.ranges);
            falseRange[instruction.target][1] = Math.min(
                instruction.value,
                falseRange[instruction.target][1],
            );
            queue.push({ instruction: instruction.falseBranch, ranges: falseRange });
        }
    }
    console.log("Range sum:", rangeSum);

    return rangeSum;
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
