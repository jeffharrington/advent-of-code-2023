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

        console.log(x, y, z);
        console.log(dx, dy, dz);

        const point1 = [x, y];
        const point2 = [x + dx, y + dy];

        const m = (point2[1] - point1[1]) / (point2[0] - point1[0]);
        console.log("Slope is", m);
        const b = point1[1] - m * point1[0];
        lineEquations.push([m, b, x, y, z, dx, dy, dz]);
    });

    let count = 0;
    const min = 200000000000000;
    const max = 400000000000000;
    // const min = 7;
    // const max = 27;
    for (let i = 0; i < lineEquations.length; i++) {
        console.log("----------------------------------------");
        console.log("Line", i, "is", lineEquations[i]);
        for (let j = i + 1; j < lineEquations.length; j++) {
            if (i === j) {
                continue;
            }
            const intersectionPoint = intersection(lineEquations[i], lineEquations[j]);
            if (intersectionPoint) {
                console.log("Line", i, "and", j, "intersect at", intersectionPoint);
                const [intersectionX, intersectionY] = intersectionPoint;
                const [m1, b1, x1, y1, z1, dx1, dy1, dz1] = lineEquations[i];
                const [m2, b2, x2, y2, z2, dx2, dy2, dz2] = lineEquations[j];
                if (dx1 > 0 && intersectionX < x1) {
                    console.log("X1 is too low");
                    continue;
                } else if (dx1 < 0 && intersectionX > x1) {
                    console.log("X1 is too high");
                    continue;
                }
                if (dy1 > 0 && intersectionY < y1) {
                    console.log("Y1 is too low");
                    continue;
                } else if (dy1 < 0 && intersectionY > y1) {
                    console.log("Y1 is too high");
                    continue;
                }
                if (dx2 > 0 && intersectionX < x2) {
                    console.log("X2 is too low");
                    continue;
                } else if (dx2 < 0 && intersectionX > x2) {
                    console.log("X2 is too high");
                    continue;
                }
                if (dy2 > 0 && intersectionY < y2) {
                    console.log("Y2 is too low");
                    continue;
                } else if (dy2 < 0 && intersectionY > y2) {
                    console.log("Y2 is too high");
                    continue;
                }
                if (
                    intersectionX >= min &&
                    intersectionX <= max &&
                    intersectionY >= min &&
                    intersectionY <= max
                ) {
                    console.log("Success!");
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

// 69296 -- Too high
// 16681 -- Too low
