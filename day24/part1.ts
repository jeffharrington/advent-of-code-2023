import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 24: Never Tell Me The Odds
 * https://adventofcode.com/2023/day/24
 */
const process = (lines: string[]) => {
    const lineEquations = lines.reduce((acc: number[][], line) => {
        const [left, right] = line.split(" @ ");
        const [x, y, z] = left.split(", ").map((n) => parseInt(n));
        const [dx, dy, dz] = right.split(", ").map((n) => parseInt(n));
        const point1 = [x, y];
        const point2 = [x + dx, y + dy];
        const m = (point2[1] - point1[1]) / (point2[0] - point1[0]); // slope
        const b = point1[1] - m * point1[0]; // y-intercept
        return [...acc, [m, b, x, y, z, dx, dy, dz]];
    }, []);
    const min = 200000000000000;
    const max = 400000000000000;
    const count = countIntersections(lineEquations[0], lineEquations.slice(1), min, max, 0);
    return count;
};

const countIntersections = (
    currEquation: number[] | undefined,
    lineEquations: number[][],
    min: number,
    max: number,
    count: number,
): number => {
    if (currEquation == undefined) {
        return count;
    }
    const newCount = lineEquations.reduce((acc: number, lineEquation) => {
        const intersectionPoint = intersection(currEquation, lineEquation);
        if (intersectionPoint) {
            const [intersectionX, intersectionY] = intersectionPoint;
            const [m1, b1, x1, y1, z1, dx1, dy1, dz1] = currEquation;
            const [m2, b2, x2, y2, z2, dx2, dy2, dz2] = lineEquation;
            if (dx1 > 0 && intersectionX < x1) {
                return acc;
            } else if (dx1 < 0 && intersectionX > x1) {
                return acc;
            }
            if (dy1 > 0 && intersectionY < y1) {
                return acc;
            } else if (dy1 < 0 && intersectionY > y1) {
                return acc;
            }
            if (dx2 > 0 && intersectionX < x2) {
                return acc;
            } else if (dx2 < 0 && intersectionX > x2) {
                return acc;
            }
            if (dy2 > 0 && intersectionY < y2) {
                return acc;
            } else if (dy2 < 0 && intersectionY > y2) {
                return acc;
            }
            if (
                intersectionX >= min &&
                intersectionX <= max &&
                intersectionY >= min &&
                intersectionY <= max
            ) {
                return acc + 1;
            }
        }
        return acc;
    }, count);
    return countIntersections(lineEquations[0], lineEquations.slice(1), min, max, newCount);
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
