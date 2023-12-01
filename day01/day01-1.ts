import * as fsPromise from "fs/promises";

/**
 * Day 1: Trebuchet?!
 * https://adventofcode.com/2023/day/1
 */
(async (filepath = "./day01/input.txt") => {
  const fileContent = await fsPromise.readFile(filepath, "utf-8");
  const lines = fileContent.split("\n");

  const allNumbers = lines.map((line) => {
    const numbersInLine = Array.from(line).filter((c) => !isNaN(parseInt(c)));
    const firstNumber = numbersInLine[0];
    const lastNumber = numbersInLine[numbersInLine.length - 1];
    return parseInt(firstNumber + lastNumber);
  });

  const sum = allNumbers.reduce((a, b) => a + b, 0);

  console.log(sum);
})();
