import { main, matrixEqual } from "./part2.js";

describe("day14/part2", () => {
    it("should match test answer", async () => {
        const matrixA = [["a"], ["b"], ["c"]];
        const matrixB = [["a"], ["b"], ["c"]];
        const answer = matrixEqual(matrixA, matrixB);
        expect(answer).toBe(true);

        const matrixC = "O....#....".split("").map((char) => [char]);
        const matrixD = "O....#....".split("").map((char) => [char]);
        const answer2 = matrixEqual(matrixC, matrixD);
        expect(answer2).toBe(true);
    });
});
