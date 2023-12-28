import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 20: Pulse Propagation
 * https://adventofcode.com/2023/day/20
 */
const HIGH = true;
const LOW = false;

type Module = {
    type: string; // broadcaster, flipFlop, conjunction,
    inputs: string[];
    outputs: string[];
    state: Record<string, boolean>;
};

type Press = {
    pulse: boolean; // HIGH or LOW
    to: string; // module name
    from: string; // module name
};

const process = (lines: string[]) => {
    const modules: Record<string, Module> = {};

    lines.forEach((line) => {
        const [left, right] = line.split(" -> ");
        let moduleKey = "";
        let moduleType = ""; // broadcaster, flipFlop, conjunction,
        let moduleState = {};
        if (left === "broadcaster") {
            moduleKey = left;
            moduleType = left;
            moduleState = {};
        } else if (left[0] == "%") {
            moduleKey = left.slice(1);
            moduleType = "flipFlop";
            moduleState = { self: false };
        } else if (left[0] == "&") {
            moduleKey = left.slice(1);
            moduleType = "conjunction";
            moduleState = {};
        }
        const module = modules[moduleKey] || {};
        module.type = moduleType;
        module.state = module.state || moduleState;
        module.outputs = right.split(", ");
        module.outputs.forEach((outputKey) => {
            const outputModule = modules[outputKey] || {};
            outputModule.inputs = [...(outputModule.inputs || []), moduleKey];
            modules[outputKey] = outputModule;
        });
        modules[moduleKey] = module;
    });

    // Initialize state for all conjunctions
    Object.keys(modules).forEach((key) => {
        const module = modules[key];
        if (module.type == "conjunction") {
            module.inputs.forEach((inputKey) => {
                module.state[inputKey] = false;
            });
        }
    });

    const vdCounts: Record<string, number> = {};
    const queue: Press[] = [];
    let rxCycle = 0; // lowest common multiple of RX press
    const targetConjunction = modules["rx"].inputs[0];

    for (let i = 0; i < Infinity; i++) {
        if (rxCycle !== 0) break;

        queue.push({ from: "button", to: "broadcaster", pulse: LOW }); // Button press
        while (queue.length > 0) {
            const press = queue.shift();
            if (press == undefined) break;

            if (press.to === targetConjunction && press.pulse === HIGH) {
                vdCounts[press.from] = vdCounts[press.from] || Infinity;
                vdCounts[press.from] = Math.min(vdCounts[press.from], i + 1);
                if (
                    modules[targetConjunction].inputs.every((input) => {
                        return !!vdCounts[input];
                    })
                ) {
                    rxCycle = findLCM(Object.values(vdCounts));
                    queue.splice(0, queue.length); // Clear queue
                }
            }
            const currModule = modules[press.to];
            let nextPulse = press.pulse;
            if (currModule.type == "broadcaster") {
                nextPulse = press.pulse;
            } else if (currModule.type == "flipFlop") {
                if (press.pulse == HIGH) continue; // ignore high pulses
                currModule.state.self = !currModule.state.self;
                nextPulse = currModule.state.self ? HIGH : LOW;
            } else if (currModule.type == "conjunction") {
                currModule.state[press.from] = press.pulse;
                const allHigh = Object.values(currModule.state).every((value) => value === true);
                nextPulse = !allHigh;
            } else {
                continue; // ignore unknown modules
            }
            currModule.outputs.forEach((node) => {
                queue.push({ from: press.to, pulse: nextPulse, to: node });
            });
        }
    }
    return rxCycle;
};

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

function findLCM(numbers: number[]): number {
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        result = lcm(result, numbers[i]);
    }
    return result;
}

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
