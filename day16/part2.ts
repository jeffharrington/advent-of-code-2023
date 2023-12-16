import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 16: The Floor Will Be Lava
 * https://adventofcode.com/2023/day/16
 */
enum Direction {
    NORTH = "NORTH",
    EAST = "EAST",
    SOUTH = "SOUTH",
    WEST = "WEST",
}

type Beam = {
    row: number;
    col: number;
    dir: Direction;
};

const process = (lines: string[]) => {
    const matrix = lines.map((line) => line.split(""));
    let maxEnergized = 0;
    // First Row (going South)
    let row = 0;
    for (let col = 0; col < matrix[0].length; col++) {
        const numEnergized = reflect(matrix, { row, col, dir: Direction.SOUTH });
        maxEnergized = Math.max(maxEnergized, numEnergized);
    }
    // Last Row (going North)
    row = matrix.length - 1;
    for (let col = 0; col < matrix[0].length; col++) {
        const numEnergized = reflect(matrix, { row, col, dir: Direction.NORTH });
        maxEnergized = Math.max(maxEnergized, numEnergized);
    }
    // First Column (going East)
    let col = 0;
    for (let row = 0; row < matrix.length; row++) {
        const numEnergized = reflect(matrix, { row, col, dir: Direction.EAST });
        maxEnergized = Math.max(maxEnergized, numEnergized);
    }
    // Last Column (going West)
    col = matrix[0].length - 1;
    for (let row = 0; row < matrix.length; row++) {
        const numEnergized = reflect(matrix, { row, col, dir: Direction.WEST });
        maxEnergized = Math.max(maxEnergized, numEnergized);
    }
    return maxEnergized;
};

function reflect(matrix: string[][], startingBeam: Beam) {
    const visited = new Set<string>();
    const energized = new Set<string>();
    const beams = [startingBeam];
    while (beams.length > 0) {
        beams.forEach((beam, beamIndex) => {
            energized.add(`${beam.row},${beam.col}`);
            visited.add(`${beam.row},${beam.col},${beam.dir}`);
            switch (matrix[beam.row][beam.col]) {
                case "/":
                    if (beam.dir === Direction.EAST) {
                        beam.dir = Direction.NORTH;
                    } else if (beam.dir === Direction.WEST) {
                        beam.dir = Direction.SOUTH;
                    } else if (beam.dir === Direction.SOUTH) {
                        beam.dir = Direction.WEST;
                    } else if (beam.dir === Direction.NORTH) {
                        beam.dir = Direction.EAST;
                    }
                    break;
                case "\\":
                    if (beam.dir === Direction.EAST) {
                        beam.dir = Direction.SOUTH;
                    } else if (beam.dir === Direction.WEST) {
                        beam.dir = Direction.NORTH;
                    } else if (beam.dir === Direction.SOUTH) {
                        beam.dir = Direction.EAST;
                    } else if (beam.dir === Direction.NORTH) {
                        beam.dir = Direction.WEST;
                    }
                    break;
                case "|":
                    if (beam.dir === Direction.EAST || beam.dir === Direction.WEST) {
                        beam.dir = Direction.NORTH;
                        if (!visited.has(`${beam.row},${beam.col},${Direction.SOUTH}`)) {
                            beams.push({ row: beam.row, col: beam.col, dir: Direction.SOUTH });
                        }
                    }
                    break;
                case "-":
                    if (beam.dir === Direction.NORTH || beam.dir === Direction.SOUTH) {
                        beam.dir = Direction.EAST;
                        if (!visited.has(`${beam.row},${beam.col},${Direction.WEST}`)) {
                            beams.push({ row: beam.row, col: beam.col, dir: Direction.WEST });
                        }
                    }
                    break;
            }
            switch (beam.dir) {
                case Direction.NORTH:
                    beam.row -= 1;
                    break;
                case Direction.EAST:
                    beam.col += 1;
                    break;
                case Direction.SOUTH:
                    beam.row += 1;
                    break;
                case Direction.WEST:
                    beam.col -= 1;
                    break;
            }
            if (
                visited.has(`${beam.row},${beam.col},${beam.dir}`) || // Already done this
                beam.row < 0 || // Falling off north edge
                beam.row >= matrix.length || // Falling off south edge
                beam.col < 0 || // Falling off west edge
                beam.col >= matrix[0].length // Falling off east edge
            ) {
                beams.splice(beamIndex, 1); // Kill this beam
            }
        });
    }
    return energized.size;
}

/**
 * Main execution function
 */
export function main(filename: string): number {
    const currentDirectory = dirname(fileURLToPath(import.meta.url));
    const filepath = `${currentDirectory}/${filename}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const start = new Date().getTime();
    const answer = process(lines);
    const elapsed = new Date().getTime() - start;
    console.log(answer);
    console.log("Finished in", elapsed, "ms");
    return answer;
}

main("input.txt");
