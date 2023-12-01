import * as fsPromise from "fs/promises";

/**
 * Day 1: Trebuchet?! (Part 2)
 * https://adventofcode.com/2023/day/1
 */
(async (filepath = "./day01/input.txt") => {
  const fileContent = await fsPromise.readFile(filepath, "utf-8");
  const lines = fileContent.split("\n");

  const NUMBER_MAP: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };

  const allNumbers = lines.map((line) => {
    const numbersInLine = [];
    for (let i = 0; i < line.length; i++) {
      if (!isNaN(parseInt(line[i]))) {
        // If it's a number, just push it
        numbersInLine.push(line[i]);
      } else {
        // If it's not a number, check if it's a number word
        Object.keys(NUMBER_MAP).forEach((key: string) => {
          if (line.substring(i).startsWith(key)) {
            numbersInLine.push(NUMBER_MAP[key]);
          }
        });
      }
    }
    const firstNumber = numbersInLine[0];
    const lastNumber = numbersInLine[numbersInLine.length - 1];
    return parseInt(firstNumber + lastNumber);
  });

  const sum = allNumbers.reduce((a, b) => a + b, 0);

  console.log(sum);
})();
