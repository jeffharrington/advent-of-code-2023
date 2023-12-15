import { main, matrixEqual, rotateClockwise, rotateCounterClockwise } from "./part2.js";

describe("day14/part2", () => {

    it("should match test answer", async () => {
        const answer = main("input.test.txt");
        expect(answer).toBe(64);
    });

    it("should match final answer", async () => {
        const answer = main("input.txt");
        expect(answer).toBe(94876);
    });

    it("matrixes should be equal", async () => {
        const matrixA = [["a"], ["b"], ["c"]];
        const matrixB = [["a"], ["b"], ["c"]];
        const answer = matrixEqual(matrixA, matrixB);
        expect(answer).toBe(true);

        const matrixC = "O....#....".split("").map((char) => [char]);
        const matrixD = "O....#....".split("").map((char) => [char]);
        const answer2 = matrixEqual(matrixC, matrixD);
        expect(answer2).toBe(true);
    });

    it("should rotate properly", async () => {
        const matrixA = [["a", "b", "c"], ["1", "2", "3"]];
        const matrixB = [["a", "b", "c"], ["1", "2", "3"]];
        const answer = matrixEqual(matrixA, matrixB);
        expect(answer).toBe(true);

        const rotatedA = rotateClockwise(matrixA);
        console.log(rotatedA);
        expect(matrixEqual(rotatedA, matrixB)).toBe(false);
        expect(rotatedA).toEqual([["1", "a"], ["2", "b"], ["3", "c"]]);

        const backA = rotateCounterClockwise(rotatedA);
        expect(matrixEqual(backA, matrixA)).toBe(true);

        const rotatedB = rotateClockwise(matrixB);
        expect(matrixEqual(rotatedB, matrixA)).toBe(false);

        const answer2 = matrixEqual(rotatedA, rotatedB);
        expect(answer2).toBe(true);
    });
});
