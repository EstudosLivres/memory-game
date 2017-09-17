/**
 * Author: Maximo Mena
 * GitHub: mmenavas
 * Twitter: @menamaximo
 * Project: Memory Workout
 * Description: This is a memory game written in pure JavaScript.
 * The goal is to match pairs of cards in the least
 * number of matching attempts.
 */

/**
 * @TODO
 * - Implement support for multiple players.
 */

/**
 * @namespace The main application object
 */
var MemoryGame = {

    groups: [
        'da-hora', 'interacao', 'tdah', 'criar',
        'sem-nome', 'hatha-yoga', 'entrada', 'diversidade',
        'pais1', 'neuropscicologia', 'qualidade-de-vida',
        'pav-caliandra', 'aprendendo-a-viver', 'gestantes',
        'pos-parto', 'adolescentes', 'pais2', 'maos-que-tecem'
    ],

    settings: {
        rows: 2,
        columns: 3
    },

    // Properties that indicate state
    cards: [], // Array of MemoryGame.Card objects
    attempts: 0, // How many pairs of cards were flipped before completing game
    mistakes: 0, // How many pairs of cards were flipped before completing game
    isGameOver: false,

    /**
     * Modify default settings to start a new game.
     * Both parameters need integers greater than one, and
     * at least one them  needs to be an even number.
     *
     * @param {number} columns
     * @param {number} rows
     * @return {array} shuffled cards
     */
    initialize: function (rows, columns) {
        var validOptions = true;

        // Validate arguments
        if (!(typeof columns === 'number' && (columns % 1) === 0 && columns > 1) ||
            !(typeof rows === 'number' && (rows % 1) === 0) && rows > 1) {
            validOptions = false;
            throw {
                name: "invalidInteger",
                message: "Both rows and columns need to be integers greater than 1."
            };
        }

        if ((columns * rows) % 2 !== 0) {
            validOptions = false;
            throw {
                name: "oddNumber",
                message: "Either rows or columns needs to be an even number."
            };
        }

        if (validOptions) {
            this.settings.rows = rows;
            this.settings.columns = columns;
            this.attempts = 0;
            this.mistakes = 0;
            this.isGameOver = false;
            this.createCards().shuffleCards();
        }

        return this.cards;
    },

    /**
     * Create an array of sorted cards
     * @return Reference to self object
     */
    createCards: function () {
        var cards = [];
        var count = 0;
        var maxValue = (this.settings.columns * this.settings.rows) / 2;

        while (count < maxValue) {
            // cards[2 * count] = new this.Card(this.groups[count]+'-name');
            // cards[2 * count + 1] = new this.Card(this.groups[count]+'-desc');



            // Adolescentro Logic
            const groupName = this.groups[count];
            if(!groupName) alert('No ' + groupName + ' at: ' + count);
            cards.push(new this.Card(groupName+'-name'));
            cards.push(new this.Card(groupName+'-desc'));

            count++;
        }

        this.cards = cards;

        return this;
    },

    /**
     * Rearrange elements in cards array
     * @return Reference to self object
     */
    shuffleCards: function () {
        var cards = this.cards;
        var shuffledCards = [];
        var randomIndex = 0;

        // Shuffle cards
        while (shuffledCards.length < cards.length) {

            // Random value between 0 and cards.length - 1
            randomIndex = Math.floor(Math.random() * cards.length);

            // If element isn't false, add element to shuffled deck
            if (cards[randomIndex]) {

                // Add new element to shuffle deck
                shuffledCards.push(cards[randomIndex]);

                // Set element to false to avoid being reused
                cards[randomIndex] = false;
            }

        }

        this.cards = shuffledCards;

        return this;
    },

    /**
     * A player gets to flip two cards. This function returns information
     * about what happens when a card is selected
     *
     * @param {number} Index of card selected by player
     * @return {object} {code: number, message: string, args: array or number}
     */
    play: (function () {
        var cardSelection = [];
        var revealedCards = 0;
        var revealedValues = [];

        return function (index) {
            var status = {};
            var value = this.cards[index].value;

            if (!this.cards[index].isRevealed) {
                this.cards[index].reveal();
                cardSelection.push(index);
                if (cardSelection.length === 2) {
                    this.attempts++;

                    // Adolescentro only logic
                    var card1 = this.cards[cardSelection[0]].value.replace('-name', '').replace('-desc', '');
                    var card2 = this.cards[cardSelection[1]].value.replace('-name', '').replace('-desc', '');

                    if (card1 !== card2) {
                        // No match
                        this.cards[cardSelection[0]].conceal();
                        this.cards[cardSelection[1]].conceal();
                        /**
                         * Algorithm to determine a mistake.
                         * Check if the pair of at least
                         * one card has been revealed before
                         *
                         * indexOf return -1 if value is not found
                         */
                        var isMistake = false;

                        if (revealedValues.indexOf(card1) === -1) {
                            revealedValues.push(card1);
                        }
                        else {
                            isMistake = true;
                        }

                        if (revealedValues.indexOf(card2) === -1) {
                            revealedValues.push(card2);
                        }

                        if (isMistake) {
                            this.mistakes++;
                        }

                        revealedValues.push(card1);

                        status.code = 3;
                        status.message = 'No Match. Conceal cards.';
                        status.args = cardSelection;
                    }
                    else {
                        revealedCards += 2;
                        if (revealedCards === this.cards.length) {
                            // Game over
                            this.isGameOver = true;
                            revealedCards = 0;
                            revealedValues = [];
                            status.code = 4;
                            status.message = 'GAME OVER! Attempts: ' + this.attempts +
                                ', Mistakes: ' + this.mistakes;
                        }
                        else {
                            status.code = 2;
                            status.message = 'Match.';
                        }
                    }
                    cardSelection = [];
                }
                else {
                    status.code = 1;
                    status.message = 'Flip first card.';
                }
            }
            else {
                status.code = 0;
                status.message = 'Card is already facing up.';
            }

            return status;

        };
    })()

};
