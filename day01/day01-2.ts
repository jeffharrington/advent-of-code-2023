import * as fsPromise from "fs/promises";

const FILEPATH = "./day01/input.txt";

(async () => {
  const fileContent = await fsPromise.readFile(FILEPATH, "utf-8");
  const lines = fileContent.split("\n");

  const allNumbers = lines.map((line) => {
    const numbersInLine = [];
    for (let i = 0; i < line.length; i++) {
      if (!isNaN(parseInt(line[i]))) {
        numbersInLine.push(line[i]);
      } else {
        if (line.substring(i).startsWith("one")) {
          numbersInLine.push("1");
        } else if (line.substring(i).startsWith("two")) {
          numbersInLine.push("2");
        } else if (line.substring(i).startsWith("three")) {
          numbersInLine.push("3");
        } else if (line.substring(i).startsWith("four")) {
          numbersInLine.push("4");
        } else if (line.substring(i).startsWith("five")) {
          numbersInLine.push("5");
        } else if (line.substring(i).startsWith("six")) {
          numbersInLine.push("6");
        } else if (line.substring(i).startsWith("seven")) {
          numbersInLine.push("7");
        } else if (line.substring(i).startsWith("eight")) {
          numbersInLine.push("8");
        } else if (line.substring(i).startsWith("nine")) {
          numbersInLine.push("9");
        }
      }
    }
    const firstNumber = numbersInLine[0];
    const lastNumber = numbersInLine[numbersInLine.length - 1];
    return parseInt(firstNumber + lastNumber);
  });

  const sum = allNumbers.reduce((a, b) => a + b, 0);

  console.log(sum);
})();
