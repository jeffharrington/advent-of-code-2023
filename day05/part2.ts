import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 5: If You Give A Seed A Fertilizer (Part 1)
 * https://adventofcode.com/2023/day/5
 */
const process = (lines: string[]) => {
    const mapKeys = {
        seedToSoil: "seed-to-soil",
        soilToFertilizer: "soil-to-fertilizer",
        fertilizerToWater: "fertilizer-to-water",
        waterToLight: "water-to-light",
        lightToTemperature: "light-to-temperature",
        temperatureToHumidity: "temperature-to-humidity",
        humidityToLocation: "humidity-to-location",
    };

    const masterMap: Record<string, number[][]> = {};
    const seeds = (lines.shift() || "")
        .split(": ")[1]
        .split(" ")
        .map((str) => parseInt(str.trim()));

    let currKey = "";
    lines.forEach((line) => {
        if (line.includes("map:")) {
            currKey = line.split(" ")[0];
        } else if (line.trim().length > 0) {
            const [destStart, sourceStart, length] = line
                .split(" ")
                .map((str) => parseInt(str.trim()));
            masterMap[currKey] = masterMap[currKey] || [];
            masterMap[currKey].push([destStart, sourceStart, length]);
        }
    });

    const seedRanges = [];
    for (let i = 0; i < seeds.length; i += 2) {
        seedRanges.push([seeds[i], seeds[i] + seeds[i + 1]]);
    }

    const allSeeds = [];
    for (let i = 0; i < seeds.length; i += 2) {
        for (let j = seeds[i]; j < seeds[i] + seeds[i + 1]; j++) {
            allSeeds.push(j);
        }
    }

    const getDestinationRange = (key: string, targetRange: number[]) => {
        const [targetStart, targetEnd] = targetRange;
        let destination: number[] = [];
        masterMap[key].forEach(([destStart, sourceStart, length]) => {
            const sourceEnd = sourceStart + length;
            console.log("Checking", [targetStart, targetEnd], "within", [sourceStart, sourceEnd]);

            if (
                (targetStart >= sourceStart && targetStart < sourceEnd) ||
                (targetEnd >= sourceStart && targetEnd < sourceEnd)
            ) {
                console.log(
                    "Range: ",
                    [targetStart, targetEnd],
                    "is within",
                    sourceStart,
                    "and",
                    sourceEnd,
                    "for key",
                    key,
                );
                if (destination.length === 0) {
                    console.log("Destination found!", [destStart, destStart + length]);
                    if (destination.length === 0) {
                        destination = [destStart, destStart + length];
                    }
                }
            }
        });
        return destination.length > 0 ? destination : targetRange;
    };

    const getDestination = (key: string, source: number) => {
        let destination = -1;
        masterMap[key].forEach(([destStart, sourceStart, length]) => {
            if (source >= sourceStart && source <= sourceStart + length) {
                if (destination <= 0) {
                    destination = destStart + (source - sourceStart);
                }
            }
        });
        destination = destination >= 0 ? destination : source;
        return destination;

    };

    const locations = seeds.map((seed) => {
        const soilNumber = getDestination("seed-to-soil", seed);
        const fertilizerNumber = getDestination("soil-to-fertilizer", soilNumber);
        const waterNumber = getDestination("fertilizer-to-water", fertilizerNumber);
        const lightNumber = getDestination("water-to-light", waterNumber);
        const temperatureNumber = getDestination("light-to-temperature", lightNumber);
        const humidityNumber = getDestination("temperature-to-humidity", temperatureNumber);
        const locationNumber = getDestination("humidity-to-location", humidityNumber);
        return locationNumber;
    });

    return Math.min(...locations);
};

/**
 * Main execution function
 */
const FILENAME = "input.txt";
(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filepath = `${__dirname}/${FILENAME}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
})();
