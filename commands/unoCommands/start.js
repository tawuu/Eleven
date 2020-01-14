module.exports.names = ["start"];

const Game = require(`../../unoSystem/startGameClass.js`);

module.exports.run = (client, message, args, database) => {

    let Cards = [
        { number: 1, color: "blue", type: "normal", image: "unavailable", id: 01 },
        { number: 2, color: "blue", type: "normal", image: "unavailable", id: 02 },
        { number: 3, color: "blue", type: "normal", image: "unavailable", id: 03 },
        { number: 4, color: "blue", type: "normal", image: "unavailable", id: 04 },
        { number: 5, color: "blue", type: "normal", image: "unavailable", id: 05 },
        { number: 6, color: "blue", type: "normal", image: "unavailable", id: 06 },
        { number: 7, color: "blue", type: "normal", image: "unavailable", id: 07 },
        { number: 8, color: "blue", type: "normal", image: "unavailable", id: 08 },
        { number: 9, color: "blue", type: "normal", image: "unavailable", id: 09 }
    ]

    let Players = [{
        name: "Eduarda",
        id: 1,
        cards: []
    }, {
        name: "Fagner",
        id: 2,
        cards: []
    }]

    Uno = new Game(Players, Cards);

    Players.forEach(Player => Uno.generateDeck(Player));

    console.log(Uno);
}