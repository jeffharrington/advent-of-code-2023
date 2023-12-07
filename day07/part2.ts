import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

interface Hand {
    cards: string[];
    counts: Record<string, number>;
    strength: number;
    bid: number;
}

/**
 * Day 7: Camel Cards (Part 2)
 * https://adventofcode.com/2023/day/7
 */
const process = (lines: string[]) => {
    const cardRank = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];
    const JOKER_CARD = "J";
    const hands: Hand[] = lines.map((line) => {
        const [cards, bid] = line.split(" ");
        const hand: Hand = {
            cards: Array.from(cards),
            bid: parseInt(bid),
            strength: 0,
            counts: {},
        };
        hand.counts = hand.cards.reduce((acc: Record<string, number>, card) => {
            acc[card] = acc[card] || 0;
            acc[card] += 1;
            return acc;
        }, {});
        const sortedCards = hand.cards
            .filter((card) => card !== JOKER_CARD)
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
        const bestCard = sortedCards.length > 0 ? sortedCards[0] : JOKER_CARD;
        hand.strength = Object.keys(hand.counts).reduce((acc: number, key: string) => {
            let count = hand.counts[key];
            if (key === JOKER_CARD) {
                if (hand.counts[key] == 5) {
                    return acc + count ** 2; // "5 Jokers" is scored as a 5 of a kind
                } else {
                    return acc; // Jokers are not counted in strength
                }
            } else if (key == bestCard) {
                count += hand.counts[JOKER_CARD] || 0; // Add jokers to best card's count
            }
            return acc + count ** 2; // Score is count^2
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
        return hand.bid * rank;
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
