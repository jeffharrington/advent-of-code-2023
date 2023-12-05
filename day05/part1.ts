import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Day 5: If You Give A Seed A Fertilizer (Part 1)
 * https://adventofcode.com/2023/day/5
 */
const process = (lines: string[]) => {
    const masterMap: Record<string, number[][]> = {};
    let currKey = "";
    let seeds: number[] = [];
    lines.forEach((line) => {
        // console.log("--------------------------");
        // console.log(line);
        if (line.includes("seeds:")) {
            seeds = line
                .split(": ")[1]
                .split(" ")
                .map((str) => parseInt(str.trim()));
        } else if (line.includes("seed-to-soil")) {
            currKey = "seed-to-soil";
        } else if (line.includes("soil-to-fertilizer")) {
            currKey = "soil-to-fertilizer";
        } else if (line.includes("fertilizer-to-water")) {
            currKey = "fertilizer-to-water";
        } else if (line.includes("water-to-light")) {
            currKey = "water-to-light";
        } else if (line.includes("light-to-temperature")) {
            currKey = "light-to-temperature";
        } else if (line.includes("temperature-to-humidity")) {
            currKey = "temperature-to-humidity";
        } else if (line.includes("humidity-to-location")) {
            currKey = "humidity-to-location";
        } else if (line.trim().length === 0) {
            return;
        } else {
            const [destStart, sourceStart, length] = line
                .split(" ")
                .map((str) => parseInt(str.trim()));
            // console.log("Map numbers found for", currKey, ":", destStart, sourceStart, length);
            masterMap[currKey] = masterMap[currKey] || [];
            masterMap[currKey].push([destStart, sourceStart, length]);
        }
    });

    const locations = seeds.map((seed) => {
        let soilNumber = 0;
        masterMap["seed-to-soil"].forEach(([destStart, sourceStart, length]) => {
            if (seed >= sourceStart && seed <= sourceStart + length) {
                soilNumber = destStart + (seed - sourceStart);
            }
        });
        soilNumber = soilNumber || seed;
        let fertilizerNumber = 0;
        masterMap["soil-to-fertilizer"].forEach(([destStart, sourceStart, length]) => {
            if (soilNumber >= sourceStart && soilNumber <= sourceStart + length) {
                fertilizerNumber = destStart + (soilNumber - sourceStart);
            }
        });
        fertilizerNumber = fertilizerNumber || soilNumber;
        let waterNumber = 0;
        masterMap["fertilizer-to-water"].forEach(([destStart, sourceStart, length]) => {
            if (fertilizerNumber >= sourceStart && fertilizerNumber < sourceStart + length) {
                waterNumber = destStart + (fertilizerNumber - sourceStart);
            }
        });
        waterNumber = waterNumber || fertilizerNumber;
        let lightNumber = 0;
        masterMap["water-to-light"].forEach(([destStart, sourceStart, length]) => {
            if (waterNumber >= sourceStart && waterNumber <= sourceStart + length) {
                lightNumber = destStart + (waterNumber - sourceStart);
            }
        });
        lightNumber = lightNumber || waterNumber;
        let temperatureNumber = 0;
        masterMap["light-to-temperature"].forEach(([destStart, sourceStart, length]) => {
            if (lightNumber >= sourceStart && lightNumber <= sourceStart + length) {
                temperatureNumber = destStart + (lightNumber - sourceStart);
            }
        });
        temperatureNumber = temperatureNumber || lightNumber;
        let humidityNumber = 0;
        masterMap["temperature-to-humidity"].forEach(([destStart, sourceStart, length]) => {
            if (temperatureNumber >= sourceStart && temperatureNumber <= sourceStart + length) {
                humidityNumber = destStart + (temperatureNumber - sourceStart);
            }
        });
        humidityNumber = humidityNumber || temperatureNumber;
        let locationNumber = 0;
        masterMap["humidity-to-location"].forEach(([destStart, sourceStart, length]) => {
            if (humidityNumber >= sourceStart && humidityNumber <= sourceStart + length) {
                locationNumber = destStart + (humidityNumber - sourceStart);
            }
        });
        locationNumber = locationNumber || humidityNumber;
        return locationNumber;
    });

    return Math.min(...locations);
};

/**
 * Main execution function
 */
const FILENAME = "input.test.txt";
(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filepath = `${__dirname}/${FILENAME}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
})();
