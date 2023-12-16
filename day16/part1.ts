import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

enum Direction {
    NORTH = "NORTH",
    EAST = "EAST",
    SOUTH = "SOUTH",
    WEST = "WEST",
}

interface Beam {
    row: number;
    col: number;
    dir: Direction;
}

/**
 * Day 16: The Floor Will Be Lava
 * https://adventofcode.com/2023/day/16
 */
const process = (lines: string[]) => {
    const matrix = lines.map((line) => line.split(""));
    const numEnergized = reflect(matrix, { row: 0, col: 0, dir: Direction.EAST });
    return numEnergized;
};

function reflect(matrix: string[][], startingBeam: Beam) {
    const visited = new Set<string>();
    const energized = new Set<string>();
    const beams = [startingBeam];
    while (beams.length > 0) {
        beams.forEach((beam, beamIndex) => {
            energized.add(`${beam.row},${beam.col}`);
            visited.add(`${beam.row},${beam.col},${beam.dir}`);
            const curr = matrix[beam.row][beam.col];
            switch (curr) {
                case ".":
                    break;
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
    const answer = process(lines);
    console.log(answer);
    return answer;
}

main("input.txt");
