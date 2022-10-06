function init() {
    const gameManager = new GameManger();
}

class GameManger {
    constructor() {
        this.bindEvents();
        this.turnsWrapper = document.getElementById('turns');
        this.winsLabel = document.getElementById('wins');
        this.losesLabel = document.getElementById('loses');
        this.deck = null;
        this.prevCard = null;
        this.correctGuesses = 0;
        this.wins = 0;
        this.losses = 0;
        this.gameOver = true;
    }

    bindEvents() {
        let self = this;

        document.getElementById('start').onclick = function() {
            self.start();
        };

        document.getElementById('guess_lower').onclick = function() {
            if (self.gameOver) {
                return false;
            }

            self.guess('lower');
        };

        document.getElementById('guess_higher').onclick = function() {
            if (self.gameOver) {
                return false;
            }

            self.guess('higher');
        };

        document.getElementById('restart').onclick = function() {
            if (!self.gameOver) {
                return false;
            }

            self.restart();
        };
    }

    start() {
        this.gameOver = false;
        document.getElementById('start').style = 'display:none;';
        this.resetDeck();
        this.firstTurn();
    }

    restart() {
        this.gameOver = false;
        this.correctGuesses = 0;
        this.turnsWrapper.innerHTML = '';
        this.resetDeck();
        this.firstTurn();
    }

    firstTurn() {
        let card = this.deck.getNextCard();
        this.prevCard = card;
        this.renderTurn(card);
        this.renderGui();
    }

    guess(guess) {
        let card = this.deck.getNextCard();
        let isCorrect = false;

        if (
            (guess === 'lower' && card.value < this.prevCard.value)
            || (guess === 'higher' && card.value > this.prevCard.value)
        ) {
            isCorrect = true;
            this.correctGuesses++;
        }

        this.prevCard = card;
        this.renderTurn(card, isCorrect);

        if (!isCorrect) {
            this.gameOver = true;
            this.losses++;
            alert("Sorry you've lost.");
        }

        if (this.correctGuesses === 5) {
            this.gameOver = true;
            this.wins++;
            alert("Congrats you've won.");
        }

        this.renderGui();
    }

    renderGui() {
        this.winsLabel.textContent = this.wins;
        this.losesLabel.textContent = this.losses;

        if (!this.gameOver) {
            document.getElementById('guess_lower').style = 'display:inline-block';
            document.getElementById('guess_higher').style = 'display:inline-block';
            document.getElementById('restart').style = 'display:none';
        } else {
            document.getElementById('guess_lower').style = 'display:none';
            document.getElementById('guess_higher').style = 'display:none';
            document.getElementById('restart').style = 'display:inline-block';
        }
        
    }

    renderTurn(card, isCorrect) {
        
        let turn = document.createElement('div');
        
        turn.innerHTML = card.suit + ' ' + card.display_value;

        let classes = 'turn';

        if (isCorrect === true) {
            classes += ' correct';
        } else if (isCorrect === false) {
            classes += ' incorrect';
        }

        turn.className = classes;

        this.turnsWrapper.appendChild(turn);
    }

    resetDeck() {
        this.deck = new Deck();
    }
}

class Deck {
    constructor() {
        this._deck = this.createDeck();
    }

    getNextCard() {
        let randomIndex = Math.floor(Math.random() * (this._deck.length - 1));
        let removedCards = this._deck.splice(randomIndex, 1);
        
        return removedCards[0];
    }

    createDeck() {
        const suits = ['&#9824;', '&#9829;', '&#9827;', '&#9830;'];
        const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        const display_value = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

        const deck = [];

        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < values.length; j++) {
                deck.push({
                    suit: suits[i],
                    value: values[j],
                    display_value: display_value[j],
                });
            }
        }

        return deck;
    }
}