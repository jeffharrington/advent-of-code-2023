import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 25: Snowverload
 * https://adventofcode.com/2023/day/25
 */
const process = (lines: string[]) => {
    // Solution cribbed from https://www.reddit.com/r/adventofcode/comments/18qbsxs/comment/ketzp94/
    const graph: Record<string, Set<string>> = {};
    lines.forEach((line) => {
        const [key, right] = line.split(": ");
        const children = right.split(" ");
        graph[key] = graph[key] || new Set();
        children.forEach((child) => {
            graph[child] = graph[child] || new Set();
            graph[child].add(key);
            graph[key].add(child);
        });
    });
    const allVertices = new Set<string>(Object.keys(graph));

    let sum = sumArray(
        Array.from(allVertices).map((v) => count_uncommon_neighbors(graph, allVertices, v)),
    );
    while (sum !== 3) {
        let vertexToRemove = "";
        let maxCount = -1;
        Array.from(allVertices).forEach((v) => {
            const c = count_uncommon_neighbors(graph, allVertices, v);
            if (c >= maxCount) {
                vertexToRemove = v;
                maxCount = c;
            }
        });
        allVertices.delete(vertexToRemove);
        sum = sumArray(
            Array.from(allVertices).map((v) => count_uncommon_neighbors(graph, allVertices, v)),
        );
    }
    const result = allVertices.size * difference(new Set(Object.keys(graph)), allVertices).size;
    return result;
};

function sumArray(arr: number[]) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}

function count_uncommon_neighbors(
    graph: Record<string, Set<string>>,
    common_set: Set<string>,
    vertex: string,
) {
    return difference(graph[vertex], common_set).size;
}

function difference(setA: Set<string>, setB: Set<string>): Set<string> {
    return new Set([...setA].filter((x) => !setB.has(x)));
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
