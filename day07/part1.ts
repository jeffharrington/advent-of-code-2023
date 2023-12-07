import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

interface Hand {
    cards: string[];
    strength: number;
    bid: number;
}

/**
 * Day 7: Camel Cards (Part 1)
 * https://adventofcode.com/2023/day/7
 */
const process = (lines: string[]) => {
    const cardRank = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
    const hands: Hand[] = lines.map((line) => {
        const [cards, bid] = line.split(" ");
        const hand: Hand = { cards: Array.from(cards), bid: parseInt(bid), strength: 0 };
        const handCounts = hand.cards.reduce((acc: Record<string, number>, curr) => {
            acc[curr] = acc[curr] || 0;
            acc[curr] += 1;
            return acc;
        }, {});
        hand.strength = Object.keys(handCounts).reduce((acc: number, key: string) => {
            const count = handCounts[key];
            let score = 0;
            if (count === 1) {
                score += 0;
            } else if (count === 2) {
                score += 1;
            } else if (count === 3) {
                score += 3;
            } else if (count === 4) {
                score += 5;
            } else if (count === 5) {
                score += 7;
            }
            return acc + score;
        }, 0);
        return hand;
    });
    const sortedHands = Array.from(hands).sort((hand1, hand2) => {
        if (hand1.strength < hand2.strength) {
            return -1;
        } else if (hand1.strength > hand2.strength) {
            return 1;
        } else {
            for (let i = 0; i < hand1.cards.length; i++) {
                if (cardRank.indexOf(hand1.cards[i]) < cardRank.indexOf(hand2.cards[i])) {
                    return -1;
                } else if (cardRank.indexOf(hand1.cards[i]) > cardRank.indexOf(hand2.cards[i])) {
                    return 1;
                }
            }
        }
        return 0;
    });
    const winnings = sortedHands.map((hand, index) => {
        const rank = index + 1;
        const winning = hand.bid * rank;
        return winning;
    });
    return winnings.reduce((a, c) => a + c, 0);
};

/**
 * Main execution function
 */
const FILENAME = "input.txt";
(async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filepath = `${__dirname}/${FILENAME}`;
    const fileContent = readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    const answer = process(lines);
    console.log(answer);
})();
