import { main } from "./part2.js";

describe("day14/part2", () => {
    it("should match test answer", async () => {
        const answer = main("input.test.txt");
        expect(answer).toBe(64);
    });

    it("should match final answer", async () => {
        const answer = main("input.txt");
        expect(answer).toBe(94876);
    });
});
