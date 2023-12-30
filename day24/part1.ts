import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day XX:
 * https://adventofcode.com/2023/day/XX
 */
const process = (lines: string[]) => {
    const lineEquations: number[][] = [];
    lines.forEach((line) => {
        const [left, right] = line.split(" @ ");
        const [x, y, z] = left.split(", ").map((n) => parseInt(n));
        const [dx, dy, dz] = right.split(", ").map((n) => parseInt(n));
        const point1 = [x, y];
        const point2 = [x + dx, y + dy];
        const m = (point2[1] - point1[1]) / (point2[0] - point1[0]);
        const b = point1[1] - m * point1[0];
        lineEquations.push([m, b, x, y, z, dx, dy, dz]);
    });

    let count = 0;
    const min = 200000000000000;
    const max = 400000000000000;
    for (let i = 0; i < lineEquations.length; i++) {
        for (let j = i + 1; j < lineEquations.length; j++) {
            if (i === j) {
                continue;
            }
            const intersectionPoint = intersection(lineEquations[i], lineEquations[j]);
            if (intersectionPoint) {
                const [intersectionX, intersectionY] = intersectionPoint;
                const [m1, b1, x1, y1, z1, dx1, dy1, dz1] = lineEquations[i];
                const [m2, b2, x2, y2, z2, dx2, dy2, dz2] = lineEquations[j];
                if (dx1 > 0 && intersectionX < x1) {
                    continue;
                } else if (dx1 < 0 && intersectionX > x1) {
                    continue;
                }
                if (dy1 > 0 && intersectionY < y1) {
                    continue;
                } else if (dy1 < 0 && intersectionY > y1) {
                    continue;
                }
                if (dx2 > 0 && intersectionX < x2) {
                    continue;
                } else if (dx2 < 0 && intersectionX > x2) {
                    continue;
                }
                if (dy2 > 0 && intersectionY < y2) {
                    continue;
                } else if (dy2 < 0 && intersectionY > y2) {
                    continue;
                }
                if (
                    intersectionX >= min &&
                    intersectionX <= max &&
                    intersectionY >= min &&
                    intersectionY <= max
                ) {
                    count++;
                }
            }
        }
    }
    return count;
};

const intersection = (line1: number[], line2: number[]) => {
    const [m1, b1] = line1;
    const [m2, b2] = line2;
    if (m1 === m2) {
        return null; // Will not intersect
    }
    const intersectionX = (b2 - b1) / (m1 - m2);
    const intersectionY = m1 * intersectionX + b1;
    return [intersectionX, intersectionY];
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
