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
    truthy: string | Instruction;
    falsy: string | Instruction;
};

function processInstruction(instruction: string): string | Instruction {
    const instructionRegex = /^([xmas])([<>])(\d+):(\w*),(.*)$/;
    const matches = instructionRegex.exec(instruction);
    if (matches) {
        const [_, target, check, value, truthy, falsy] = matches;
        return {
            target,
            check,
            value: parseInt(value),
            truthy: processInstruction(truthy),
            falsy: processInstruction(falsy),
        };
    } else {
        return instruction;
    }
}

function getInstructionDataset(
    instruction: Instruction | string,
    dataset: Record<string, number[]>,
): Record<string, number[]> {
    console.log(instruction);
    if (typeof instruction === "string") {
        return dataset;
    }
    dataset[instruction.target].push(instruction.value + 1);
    dataset[instruction.target].push(instruction.value - 1);
    dataset = getInstructionDataset(instruction.truthy, dataset);
    dataset = getInstructionDataset(instruction.falsy, dataset);
    return dataset;
}

const process = (lines: string[]) => {
    let processingInstructions = true;
    const instructionTree: Record<string, Instruction> = {};
    lines.forEach((line) => {
        if (line.trim() === "") processingInstructions = false;
        if (processingInstructions) {
            const [key, tail] = line.split("{");
            const [fullInstruction, _] = tail.split("}");
            instructionTree[key] = processInstruction(fullInstruction) as Instruction;
        }
    });
    let dataset: Record<string, number[]> = { x: [], m: [], a: [], s: [] };
    Object.keys(instructionTree).forEach((key) => {
        const firstInstruction = instructionTree[key];
        dataset = getInstructionDataset(firstInstruction, dataset)
    });
    console.log(dataset);
    return 0;
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

main("input.test.txt");

// 184699 too low
