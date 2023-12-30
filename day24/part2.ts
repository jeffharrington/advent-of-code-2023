import { link, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 24: Never Tell Me The Odds
 * https://adventofcode.com/2023/day/24
 */
const process = (lines: string[]) => {
    const points: number[][] = [];
    const velocities: number[][] = [];
    lines.forEach((line) => {
        const [left, right] = line.split(" @ ");
        const [x, y, z] = left.split(", ").map((n) => parseInt(n));
        const [dx, dy, dz] = right.split(", ").map((n) => parseInt(n));
        points.push([x, y, z]);
        velocities.push([dx, dy, dz]);
    });
    // Solution cribbed from https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/kersplf/
    const n = points.length;
    const v1 = velocities[0];
    const p1 = points[0];
    let p2 = points[1];
    let v2 = velocities[1];
    let p3 = points[1];
    let v3 = velocities[1];
    let i = 1;
    for (; i < n; i++) {
        if (indep(v1, velocities[i])) {
            p2 = points[i];
            v2 = velocities[i];
            break;
        }
    }
    for (let j = i + 1; j < n; j++) {
        if (indep(v1, velocities[j]) && indep(v2, velocities[j])) {
            p3 = points[j];
            v3 = velocities[j];
            break;
        }
    }
    const [rock, S] = findRock(p1, v1, p2, v2, p3, v3);
    return Math.round((rock[0] + rock[1] + rock[2]) / S);
};

const findRock = (
    p1: number[],
    v1: number[],
    p2: number[],
    v2: number[],
    p3: number[],
    v3: number[],
): [number[], number] => {
    const [a, A] = findPlane(p1, v1, p2, v2);
    const [b, B] = findPlane(p1, v1, p3, v3);
    const [c, C] = findPlane(p2, v2, p3, v3);

    const wOrig = lin(A, cross(b, c), B, cross(c, a), C, cross(a, b));
    const t = dot(a, cross(b, c));

    const wRounded = [Math.round(wOrig[0] / t), Math.round(wOrig[1] / t), Math.round(wOrig[2] / t)];

    const w1 = sub(v1, wRounded);
    const w2 = sub(v2, wRounded);
    const ww = cross(w1, w2);

    const E = dot(ww, cross(p2, w2));
    const F = dot(ww, cross(p1, w1));
    const G = dot(p1, ww);
    const S = dot(ww, ww);

    const rock = lin(E, w1, -F, w2, G, ww);
    return [rock, S];
};

const lin = (r: number, a: number[], s: number, b: number[], t: number, c: number[]) => {
    const [x1, y1, z1] = a;
    const [x2, y2, z2] = b;
    const [x3, y3, z3] = c;
    const x = r * x1 + s * x2 + t * x3;
    const y = r * y1 + s * y2 + t * y3;
    const z = r * z1 + s * z2 + t * z3;
    return [x, y, z];
};

const findPlane = (p1: number[], v1: number[], p2: number[], v2: number[]): [number[], number] => {
    const p12 = sub(p1, p2);
    const v12 = sub(v1, v2);
    const vv = cross(v1, v2);
    return [cross(p12, v12), dot(p12, vv)];
};

const dot = (p1: number[], p2: number[]) => {
    const [x1, y1, z1] = p1;
    const [x2, y2, z2] = p2;
    return x1 * x2 + y1 * y2 + z1 * z2;
};

const sub = (point1: number[], point2: number[]) => {
    const [x1, y1, z1] = point1;
    const [x2, y2, z2] = point2;
    return [x1 - x2, y1 - y2, z1 - z2];
};
const cross = (line1: number[], line2: number[]) => {
    const [x1, y1, z1] = line1;
    const [x2, y2, z2] = line2;
    return [y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2];
};

const indep = (line1: number[], line2: number[]) => {
    const crossPoint = cross(line1, line2);
    return crossPoint[0] != 0 || crossPoint[1] != 0 || crossPoint[2] != 0;
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
