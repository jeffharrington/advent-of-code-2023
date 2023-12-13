import { main, findPointsOfReflection } from "./part2.js";

describe("day13/part2", () => {
    it("should match test answer", async () => {
        const answer = main("input.test.txt");
        expect(answer).toBe(400);
    });

    it("should match test answer", async () => {
        const answer = main("input.txt");
        expect(answer).toBe(29083);
    });
});
