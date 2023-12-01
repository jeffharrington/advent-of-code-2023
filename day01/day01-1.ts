import * as fsPromise from "fs/promises";

const FILEPATH = "./day01/input.txt";

(async () => {
  const fileContent = await fsPromise.readFile(FILEPATH, "utf-8");
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
