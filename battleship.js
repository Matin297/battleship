var view = {
    displayMessage: function (msg) {
        const $msgBox = document.getElementById('notif');
        $msgBox.innerHTML = msg;
    },
    displayMiss: function (location) {
        var $cell = document.getElementById(location);
        $cell.classList.add('miss');
    },
    displayHit: function (location) {
        var $cell = document.getElementById(location);
        $cell.classList.add('hit');
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        { locations: [0, 0, 0], hits: ['', '', ''] },
        { locations: [0, 0, 0], hits: ['', '', ''] },
        { locations: [0, 0, 0], hits: ['', '', ''] },
    ],
    fire: function (location) {

        for (var i = 0; i < this.numShips; i++) {

            var ship = this.ships[i];
            var hitIndex = ship.locations.indexOf(location);

            if (hitIndex > -1) {

                view.displayHit(location);
                view.displayMessage('HIIT!');

                ship.hits[hitIndex] = "hit";

                if (this.isSunk(ship)) {
                    this.shipsSunk++;
                    view.displayMessage('You sank my battleship!');
                }

                return true;
            }

        }

        view.displayMiss(location);
        view.displayMessage('MISS!');

        return false;

    },
    isSunk: function (ship) {

        for (var i = 0; i < this.shipLength; i++) {

            if (ship.hits[i] !== 'hit')
                return false;

        }

        return true;

    },
    generateShipLocations: function () {
        var locations;

        for (var i = 0; i < this.numShips; i++) {

            do {
                locations = this.generateShip();
            } while (this.collision(locations))

            this.ships[i].locations = locations;

        }
    },
    generateShip: function () {

        // 1 -> horizontal AND 0 -> vertical
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        // generate the starting location
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {

            if (direction === 1) {
                newShipLocations.push(`${row}${col + i}`);
            } else {
                newShipLocations.push(`${row + i}${col}`);
            }

        }

        return newShipLocations;

    },
    collision: function (locations) {

        for (var i = 0; i < this.numShips; i++) {

            var ship = this.ships[i];

            for (var j = 0; j < locations.length; j++) {

                if (ship.locations.indexOf(locations[j]) > -1)
                    return true;

            }

        }

        return false;

    }
};

var controller = {
    guesses: 0,
    processGuess: function (guess) {

        var location = this.parseGuess(guess);

        const cell = document.getElementById(location);

        const isCellHit = cell.classList.contains('hit') || cell.classList.contains('miss');

        if (location && !isCellHit) {
            this.guesses++;
            var hit = model.fire(location);

            if (hit && model.shipsSunk === model.numShips)
                view.displayMessage(`You sank all my battleships in ${this.guesses} guesses!`);
        }

    },
    parseGuess: function (guess) {

        var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

        if (!guess || guess.length !== 2)
            alert("Ops, please enter a letter and a number on the board!");
        else {
            var row = alphabet.indexOf(guess[0]);
            var column = guess[1];

            if (row === -1 || isNaN(column) || column < 0 || column >= model.boardSize)
                alert("That isn't on the board!");
            else
                return row + column;
        }

        return null;

    }
};

function init() {

    var fireBtn = document.getElementById('fire-btn');
    fireBtn.onclick = fireHandler;

    var fireForm = document.getElementById('fire-form');
    fireForm.onsubmit = fireHandler;

    model.generateShipLocations();

}

function fireHandler(e) {

    e.preventDefault();

    var guessInput = document.getElementById('guess-input');
    controller.processGuess(guessInput.value);

    guessInput.value = "";

    // we return false so that the form doesn't do anything (like submitting)
    // return false;

}

window.onload = init;

// TEST DRIVE - VIEW
// view.displayMiss('00');
// view.displayHit('34');
// view.displayMiss('55');
// view.displayHit('12');
// view.displayMiss('25');
// view.displayHit('26');
// view.displayMessage('tap tap');

// TEST DRIVE - MODEL
// model.fire('00');
// model.fire('01');
// model.fire('02');
// model.fire('53');
// model.fire('06');
// model.fire('16');
// model.fire('26');
// model.fire('33');
// model.fire('34');
// model.fire('24');
// model.fire('44');

// TEST DRIVE - CONTROLLER
// console.log(controller.parseGuess('A0'));
// console.log(controller.parseGuess('B6'));
// console.log(controller.parseGuess('G3'));
// console.log(controller.parseGuess('H0'));
// console.log(controller.parseGuess('A7'));
// controller.processGuess('A0');
// controller.processGuess('A1');
// controller.processGuess('A2');

// controller.processGuess('A6');
// controller.processGuess('A5');
// controller.processGuess('B5');
// controller.processGuess('C5');
// controller.processGuess('B6');
// controller.processGuess('C6');

// controller.processGuess('B0');
// controller.processGuess('B1');
// controller.processGuess('B2');