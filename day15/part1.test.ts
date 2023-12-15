import { main } from "./part1.js";

describe("day15/part1", () => {
    it("should match test answer", async () => {
        const answer = main("input.test.txt");
        expect(answer).toBe(1320);
    });

    it("should match final answer", async () => {
        const answer = main("input.txt");
        expect(answer).toBe(521434);
    });
});
