import { main, getPointsOfReflection } from "./part1.js";

describe("day13/part1", () => {

    it("should reflect", async () => {
        const answer = getPointsOfReflection("#..#".split(""));
        console.log(answer);
        expect(answer).toEqual(new Set([1]));

        const answer2 = getPointsOfReflection("#.##..##.".split(""));
        console.log(answer2);
        expect(answer2).toEqual(new Set([4, 6]));

        const answer3 = getPointsOfReflection("##..##.####.#".split(""));
        console.log(answer3);
        expect(answer3).toEqual(new Set([2]));

        const answer4 = getPointsOfReflection("#...##..#..##".split(""));
        console.log(answer4);
        expect(answer4).toEqual(new Set([2]));


    });
});
