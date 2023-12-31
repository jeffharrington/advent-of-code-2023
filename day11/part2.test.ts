import { main } from "./part2.js";

describe("day11/part2", () => {
    it("should match test answer", async () => {
        const answer = main("input.test.txt");
        expect(answer).toBe(82000210);
    });

    it("should match real answer", async () => {
        const answer = main("input.txt");
        expect(answer).toBe(513171773355);
    });
});
