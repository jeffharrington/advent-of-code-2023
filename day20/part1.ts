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
        } else {
            throw new Error(`Unknown module type: ${left} -> ${right}`);
        }
        const module = modules[moduleKey] || {};
        module.type = moduleType;
        module.state = moduleState;
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

    const pulseCounts: Record<string, number> = { true: 0, false: 0 };
    const queue: Press[] = [];

    for (let i = 0; i < 1000; i++) {
        queue.push({ from: "button", to: "broadcaster", pulse: LOW });
        while (queue.length > 0) {
            const press = queue.shift();
            if (press == undefined) break;
            pulseCounts[press.pulse.toString()] += 1;
            const module = modules[press.to];
            let nextPulse = press.pulse;
            if (module.type == "broadcaster") {
                nextPulse = press.pulse;
            } else if (module.type == "flipFlop") {
                if (press.pulse == HIGH) continue; // ignore high pulses
                module.state.self = !module.state.self;
                nextPulse = module.state.self ? HIGH : LOW;
            } else if (module.type == "conjunction") {
                module.state[press.from] = press.pulse;
                const allHigh = Object.values(module.state).every((value) => value === true);
                nextPulse = !allHigh;
            } else {
                continue; // ignore unknown modules
            }
            module.outputs.forEach((node) => {
                queue.push({ from: press.to, pulse: nextPulse, to: node });
            });
        }
    }

    return pulseCounts["true"] * pulseCounts["false"];
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
