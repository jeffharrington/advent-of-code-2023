import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 25: Snowverload
 * https://adventofcode.com/2023/day/25
 */
const process = (lines: string[]) => {
    // Solution cribbed from https://www.reddit.com/r/adventofcode/comments/18qbsxs/comment/ketzp94/
    const graph = lines.reduce((graph: Record<string, Set<string>>, line) => {
        const [key, right] = line.split(": ");
        const children = right.split(" ");
        graph[key] = graph[key] || new Set();
        children.forEach((child) => {
            graph[child] = graph[child] || new Set();
            graph[child].add(key);
            graph[key].add(child);
        });
        return graph;
    }, {});
    const allVertices = new Set<string>(Object.keys(graph));
    const trimmedVertices = trimVertices(graph, allVertices);
    const result = trimmedVertices.size * difference(allVertices, trimmedVertices).size;
    return result;
};

function trimVertices(graph: Record<string, Set<string>>, vertices: Set<string>) {
    if (sumArray(Array.from(vertices).map((v) => difference(graph[v], vertices).size)) === 3) {
        return vertices;
    }
    const [vertexToRemove, _] = Array.from(vertices).reduce(
        (max: [string, number], vertex) => {
            const numUncommonNeighbors = difference(graph[vertex], vertices).size;
            if (numUncommonNeighbors >= max[1]) {
                return [vertex, numUncommonNeighbors] as [string, number];
            } else {
                return max;
            }
        },
        ["", -1],
    );
    let trimmedVertices = new Set([...vertices].filter((v) => v !== vertexToRemove));
    return trimVertices(graph, trimmedVertices);
}

function sumArray(arr: number[]) {
    return arr.reduce((acc, curr) => acc + curr, 0);
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
