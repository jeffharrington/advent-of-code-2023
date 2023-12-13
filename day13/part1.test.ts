import { main, findPointsOfReflection } from "./part1.js";

describe("day13/part1", () => {
    it("should match test answer", async () => {
        const answer = main("input.test.txt");
        expect(answer).toBe(405);
    });

    it("should match real answer", async () => {
        const answer = main("input.txt");
        expect(answer).toBe(33975);
    });

    it("should reflect", async () => {
        const answer = findPointsOfReflection("#..#".split(""));
        console.log(answer);
        expect(answer).toEqual(new Set([1]));

        const answer2 = findPointsOfReflection("#.##..##.".split(""));
        console.log(answer2);
        expect(answer2).toEqual(new Set([4, 6]));
    });
});
