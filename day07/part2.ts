import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

interface Hand {
    cards: string[];
    counts: Record<string, number>;
    strength: number;
    bid: number;
    num_jokers: number;
}

/**
 * Day 7: Camel Cards (Part 1)
 * https://adventofcode.com/2023/day/7
 */
const process = (lines: string[]) => {
    const cardRank = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];
    const hands: Hand[] = lines.map((line) => {
        console.log("------------------------------------------");
        console.log(line);
        const [cards, bid] = line.split(" ");
        const hand: Hand = {
            cards: Array.from(cards),
            bid: parseInt(bid),
            strength: 0,
            counts: {},
            num_jokers: 0,
        };
        hand.counts = hand.cards.reduce((acc: Record<string, number>, curr) => {
            acc[curr] = acc[curr] || 0;
            acc[curr] += 1;
            if (curr === "J") {
                hand.num_jokers += 1;
            }
            return acc;
        }, {});
        const sortedCards = Array.from(
            new Set(
                Array.from(hand.cards).sort((card1, card2) => {
                    if (cardRank.indexOf(card1) < cardRank.indexOf(card2)) {
                        return 1;
                    } else if (cardRank.indexOf(card1) > cardRank.indexOf(card2)) {
                        return -1;
                    }
                    return 0;
                }),
            ),
        );
        const bestCards = hand.cards
            .filter((card) => card !== "J")
            .sort((card1, card2) => {
                if (hand.counts[card1] > hand.counts[card2]) {
                    return -1;
                } else if (hand.counts[card1] < hand.counts[card2]) {
                    return 1;
                } else if (cardRank.indexOf(card1) > cardRank.indexOf(card2)) {
                    return -1;
                } else if (cardRank.indexOf(card1) < cardRank.indexOf(card2)) {
                    return 1;
                } else {
                    return 0;
                }
            });

        let bestCard = "";
        if (bestCards.length > 0) {
            bestCard = bestCards[0];
        } else {
            bestCard = "J";
        }

        console.log("bestCard", bestCard);
        hand.strength = Object.keys(hand.counts).reduce((acc: number, key: string) => {
            let count = hand.counts[key];
            if (key === "J") {
                if (hand.counts[key] == 5) {
                    return acc + 7;  // All J's = 7
                } else {
                    return acc;  // Jokers are not counted
                }
            }
            if (key == bestCard) count += hand.num_jokers;
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
            console.log("card", key, "count", count, "score", score);
            return acc + score;
        }, 0);
        console.log(hand);
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

    console.log("Sorted Hands ------------------------------------------\n");

    const winnings = sortedHands.map((hand, index) => {
        const rank = index + 1;
        const winning = hand.bid * rank;
        console.log(hand.cards.join(""), "-", hand.strength, "-", rank, "*", hand.bid, "=", winning);
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
